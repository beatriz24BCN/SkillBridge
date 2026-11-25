from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.exc import IntegrityError

from ..extensions import db
from ..models import Job, SavedJob, User


saved_jobs_bp = Blueprint("saved_jobs", __name__)


def _current_user_id():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return None
    return user_id if User.query.get(user_id) else None


@saved_jobs_bp.route("/", methods=["GET"])
@jwt_required()
def list_saved_jobs():
    user_id = _current_user_id()
    if user_id is None:
        return jsonify({"error": "User not found"}), 401

    saved = SavedJob.query.filter_by(user_id=user_id).order_by(SavedJob.created_at.desc()).all()
    return jsonify([item.to_dict() for item in saved]), 200


@saved_jobs_bp.route("/<int:job_id>", methods=["POST"])
@jwt_required()
def save_job(job_id):
    user_id = _current_user_id()
    if user_id is None:
        return jsonify({"error": "User not found"}), 401
    if not Job.query.get(job_id):
        return jsonify({"error": "Job not found"}), 404

    existing = SavedJob.query.filter_by(user_id=user_id, job_id=job_id).first()
    if existing:
        return jsonify(existing.to_dict()), 200

    saved = SavedJob(user_id=user_id, job_id=job_id)
    db.session.add(saved)
    try:
        db.session.commit()
        return jsonify(saved.to_dict()), 201
    except IntegrityError:
        db.session.rollback()
        existing = SavedJob.query.filter_by(user_id=user_id, job_id=job_id).first()
        return jsonify(existing.to_dict()), 200


@saved_jobs_bp.route("/<int:job_id>", methods=["DELETE"])
@jwt_required()
def remove_saved_job(job_id):
    user_id = _current_user_id()
    if user_id is None:
        return jsonify({"error": "User not found"}), 401

    saved = SavedJob.query.filter_by(user_id=user_id, job_id=job_id).first()
    if not saved:
        return jsonify({"error": "Saved job not found"}), 404

    db.session.delete(saved)
    db.session.commit()
    return jsonify({"message": "Saved job removed"}), 200
