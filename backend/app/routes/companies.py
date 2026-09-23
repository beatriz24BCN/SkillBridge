from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..extensions import db
from ..models import Company, User

companies_bp = Blueprint("companies", __name__)


@companies_bp.route("/", methods=["GET"])
def list_companies():
    companies = Company.query.all()
    return jsonify([c.to_dict(include_owner=False) for c in companies]), 200


@companies_bp.route("/<int:company_id>", methods=["GET"])
def get_company(company_id):
    c = Company.query.get(company_id)
    if not c:
        return jsonify({"error": "Company not found"}), 404
    return jsonify(c.to_dict(include_owner=True)), 200


@companies_bp.route("/", methods=["POST"])
@jwt_required()
def create_company():
    identity = get_jwt_identity()
    if not identity:
        return jsonify({"error": "Authentication required"}), 401

    user = User.query.get(identity)
    if not user:
        return jsonify({"error": "User not found"}), 401

    data = request.get_json() or {}
    # Allowed fields from model
    allowed = {"name", "description", "email", "phone", "website", "location", "logo"}
    payload = {k: data.get(k) for k in allowed}

    if not payload.get("name"):
        return jsonify({"error": "Invalid data"}), 400

    # Assign owner
    payload["owner_id"] = user.id

    try:
        comp = Company(**payload)
        db.session.add(comp)
        db.session.flush()
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500

    return jsonify(comp.to_dict(include_owner=True)), 201


@companies_bp.route("/<int:company_id>", methods=["PUT", "PATCH"])
@jwt_required()
def update_company(company_id):
    identity = get_jwt_identity()
    user = User.query.get(identity)
    if not user:
        return jsonify({"error": "User not found"}), 401

    comp = Company.query.get(company_id)
    if not comp:
        return jsonify({"error": "Company not found"}), 404

    if comp.owner_id != user.id:
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json() or {}
    allowed = ["name", "description", "email", "phone", "website", "location", "logo"]

    if "name" in data and not data.get("name"):
        return jsonify({"error": "Invalid data"}), 400

    try:
        for k in allowed:
            if k in data:
                setattr(comp, k, data.get(k))
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500

    return jsonify(comp.to_dict(include_owner=True)), 200


@companies_bp.route("/<int:company_id>", methods=["DELETE"])
@jwt_required()
def delete_company(company_id):
    identity = get_jwt_identity()
    user = User.query.get(identity)
    if not user:
        return jsonify({"error": "User not found"}), 401

    comp = Company.query.get(company_id)
    if not comp:
        return jsonify({"error": "Company not found"}), 404

    if comp.owner_id != user.id:
        return jsonify({"error": "Forbidden"}), 403

    try:
        db.session.delete(comp)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500

    return jsonify({"message": "Company deleted"}), 200
