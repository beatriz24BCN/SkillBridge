from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..extensions import db
from ..models import User, Company, Job

jobs_bp = Blueprint("jobs", __name__)


@jobs_bp.route("/", methods=["GET"])
def list_jobs():
    jobs = Job.query.all()
    return jsonify([j.to_dict(include_company=False) for j in jobs]), 200


@jobs_bp.route("/<int:job_id>", methods=["GET"])
def get_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    return jsonify(job.to_dict(include_company=True)), 200


@jobs_bp.route("/", methods=["POST"])
@jwt_required()
def create_job():
    identity = get_jwt_identity()
    if not identity:
        return jsonify({"error": "Authentication required"}), 401

    user = User.query.get(identity)
    if not user:
        return jsonify({"error": "User not found"}), 401

    data = request.get_json() or {}
    # Allowed fields
    allowed = {"title", "description", "requirements", "location", "salary", "modality", "contract_type", "company_id"}
    payload = {k: data.get(k) for k in allowed}

    # Basic validation
    if not payload.get("title") or not payload.get("description") or not payload.get("company_id"):
        return jsonify({"error": "Invalid data"}), 400

    company = Company.query.get(payload.get("company_id"))
    if not company:
        return jsonify({"error": "Company not found"}), 404

    if company.owner_id != user.id:
        return jsonify({"error": "Forbidden"}), 403

    job = Job(**payload)
    db.session.add(job)
    db.session.flush()
    db.session.commit()

    return jsonify(job.to_dict()), 201


@jobs_bp.route("/<int:job_id>", methods=["PUT"])
@jwt_required()
def put_job(job_id):
    identity = get_jwt_identity()
    user = User.query.get(identity)
    if not user:
        return jsonify({"error": "User not found"}), 401

    job = Job.query.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    company = Company.query.get(job.company_id)
    if not company or company.owner_id != user.id:
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json() or {}
    required = ["title", "description", "company_id"]
    if not all(data.get(k) for k in required):
        return jsonify({"error": "Invalid data"}), 400

    # If changing company, verify ownership
    if data.get("company_id") and data.get("company_id") != job.company_id:
        newc = Company.query.get(data.get("company_id"))
        if not newc:
            return jsonify({"error": "Company not found"}), 404
        if newc.owner_id != user.id:
            return jsonify({"error": "Forbidden"}), 403
        job.company_id = data.get("company_id")

    job.title = data.get("title")
    job.description = data.get("description")
    job.requirements = data.get("requirements")
    job.location = data.get("location")
    job.salary = data.get("salary")
    job.modality = data.get("modality")
    job.contract_type = data.get("contract_type")

    db.session.commit()
    return jsonify(job.to_dict()), 200


@jobs_bp.route("/<int:job_id>", methods=["PATCH"])
@jwt_required()
def patch_job(job_id):
    identity = get_jwt_identity()
    user = User.query.get(identity)
    if not user:
        return jsonify({"error": "User not found"}), 401

    job = Job.query.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    company = Company.query.get(job.company_id)
    if not company or company.owner_id != user.id:
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json() or {}
    allowed = ["title", "description", "requirements", "location", "salary", "modality", "contract_type", "company_id"]

    if "company_id" in data and data.get("company_id") != job.company_id:
        newc = Company.query.get(data.get("company_id"))
        if not newc:
            return jsonify({"error": "Company not found"}), 404
        if newc.owner_id != user.id:
            return jsonify({"error": "Forbidden"}), 403
        job.company_id = data.get("company_id")

    for k in allowed:
        if k in data:
            setattr(job, k, data.get(k))

    db.session.commit()
    return jsonify(job.to_dict()), 200


@jobs_bp.route("/<int:job_id>", methods=["DELETE"])
@jwt_required()
def delete_job(job_id):
    identity = get_jwt_identity()
    user = User.query.get(identity)
    if not user:
        return jsonify({"error": "User not found"}), 401

    job = Job.query.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    company = Company.query.get(job.company_id)
    if not company or company.owner_id != user.id:
        return jsonify({"error": "Forbidden"}), 403

    db.session.delete(job)
    db.session.commit()
    return jsonify({"message": "Job deleted"}), 200
