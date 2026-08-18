from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..extensions import db
from ..models.user import User


users_bp = Blueprint("users", __name__)


@users_bp.route("/", methods=["GET"])
@jwt_required()
def list_users():
    # Listing all users is not allowed until roles/admin are implemented
    return jsonify({"error": "Listing users is not permitted"}), 403


@users_bp.route("/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id: int):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    # Return only public info (exclude updated_at per spec)
    data = user.to_dict(include_updated=False)
    return jsonify({"user": data}), 200


@users_bp.route("/<int:user_id>", methods=["PATCH"])
@jwt_required()
def update_user(user_id: int):
    identity = get_jwt_identity()
    if int(identity) != int(user_id):
        return jsonify({"error": "Forbidden"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json() or {}
    email = data.get("email")
    first_name = data.get("first_name")
    last_name = data.get("last_name")

    if email:
        email = email.strip().lower()
        # Check email collision
        other = User.query.filter(User.email == email, User.id != user.id).first()
        if other:
            return jsonify({"error": "Email already registered"}), 409
        user.email = email

    if first_name is not None:
        user.first_name = first_name.strip()
    if last_name is not None:
        user.last_name = last_name.strip()

    try:
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User updated successfully", "user": user.to_dict()}), 200
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500


@users_bp.route("/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id: int):
    identity = get_jwt_identity()
    if int(identity) != int(user_id):
        return jsonify({"error": "Forbidden"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500
