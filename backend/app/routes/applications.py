from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..extensions import db
from ..models import User, Job, Application

applications_bp = Blueprint("applications", __name__)


@applications_bp.route("/", methods=["GET"])
@jwt_required()
def list_applications():
    identity = get_jwt_identity()
    try:
        uid = int(identity)
    except Exception:
        return jsonify({"error": "Invalid token identity"}), 401

    user = User.query.get(uid)
    if not user:
        return jsonify({"error": "User not found"}), 401

    apps = Application.query.filter_by(user_id=uid).all()
    return jsonify([a.to_dict(include_job=True) for a in apps]), 200


@applications_bp.route("/<int:app_id>", methods=["GET"])
@jwt_required()
def get_application(app_id):
    identity = get_jwt_identity()
    try:
        uid = int(identity)
    except Exception:
        return jsonify({"error": "Invalid token identity"}), 401

    app_obj = Application.query.get(app_id)
    if not app_obj:
        return jsonify({"error": "Application not found"}), 404

    if app_obj.user_id != uid:
        return jsonify({"error": "Forbidden"}), 403

    return jsonify(app_obj.to_dict(include_job=True, include_user=False)), 200


@applications_bp.route("/", methods=["POST"])
@jwt_required()
def create_application():
    identity = get_jwt_identity()
    try:
        uid = int(identity)
    except Exception:
        return jsonify({"error": "Invalid token identity"}), 401

    user = User.query.get(uid)
    if not user:
        return jsonify({"error": "User not found"}), 401

    data = request.get_json() or {}
    job_id = data.get("job_id")
    cover_letter = data.get("cover_letter")
    status = data.get("status")

    if not job_id:
        return jsonify({"error": "job_id is required"}), 400

    job = Job.query.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    # Prevent duplicate application by same user to same job
    existing = Application.query.filter_by(user_id=uid, job_id=job_id).first()
    if existing:
        return jsonify({"error": "Application already exists"}), 409

    try:
        payload = {"user_id": uid, "job_id": job_id, "cover_letter": cover_letter}
        if status:
            payload["status"] = status
        app_obj = Application(**payload)
        db.session.add(app_obj)
        db.session.flush()
        db.session.commit()
        return jsonify(app_obj.to_dict(include_job=True)), 201
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500


@applications_bp.route("/<int:app_id>", methods=["PUT", "PATCH"])
@jwt_required()
def update_application(app_id):
    identity = get_jwt_identity()
    try:
        uid = int(identity)
    except Exception:
        return jsonify({"error": "Invalid token identity"}), 401

    app_obj = Application.query.get(app_id)
    if not app_obj:
        return jsonify({"error": "Application not found"}), 404

    if app_obj.user_id != uid:
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json() or {}
    # Allow updating cover_letter and status
    if "cover_letter" in data:
        app_obj.cover_letter = data.get("cover_letter")

    if "status" in data:
        try:
            if data.get("status") not in Application.ALLOWED_STATUSES:
                return jsonify({"error": "Invalid status"}), 400
            app_obj.status = data.get("status")
        except Exception:
            return jsonify({"error": "Invalid status"}), 400

    try:
        db.session.add(app_obj)
        db.session.commit()
        return jsonify(app_obj.to_dict(include_job=True)), 200
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500


@applications_bp.route("/<int:app_id>", methods=["DELETE"])
@jwt_required()
def delete_application(app_id):
    identity = get_jwt_identity()
    try:
        uid = int(identity)
    except Exception:
        return jsonify({"error": "Invalid token identity"}), 401

    app_obj = Application.query.get(app_id)
    if not app_obj:
        return jsonify({"error": "Application not found"}), 404

    if app_obj.user_id != uid:
        return jsonify({"error": "Forbidden"}), 403

    try:
        db.session.delete(app_obj)
        db.session.commit()
        return jsonify({"message": "Application deleted"}), 200
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500
