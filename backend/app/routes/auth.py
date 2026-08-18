from datetime import datetime
import re

from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
)

from ..extensions import db
from ..models.user import User


auth_bp = Blueprint("auth", __name__)


def _validate_email(email: str) -> bool:
    if not email:
        return False
    email = email.strip().lower()
    # Basic email pattern
    return re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email) is not None


def _validate_password(password: str) -> bool:
    if not password or len(password) < 8:
        return False
    # At least one letter and one digit
    return re.search(r"[A-Za-z]", password) and re.search(r"\d", password)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password")
    first_name = (data.get("first_name") or "").strip()
    last_name = (data.get("last_name") or "").strip()

    if not email or not password or not first_name or not last_name:
        return jsonify({"error": "Missing required fields"}), 400

    if not _validate_email(email):
        return jsonify({"error": "Invalid email format"}), 400

    if not _validate_password(password):
        return (
            jsonify({"error": "Password must be at least 8 characters and include letters and numbers"}),
            400,
        )

    # Check duplicate
    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({"error": "Email already registered"}), 409

    try:
        user = User(email=email, first_name=first_name, last_name=last_name)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return (
            jsonify({"message": "User registered successfully", "user": user.to_dict()}),
            201,
        )
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify(
        {
            "access_token": access_token,
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            },
        }
    ), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    identity = get_jwt_identity()
    try:
        identity = int(identity)
    except Exception:
        return jsonify({"error": "Invalid token identity"}), 401
    user = User.query.get(identity)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user": user.to_dict()}), 200


@auth_bp.route("/me", methods=["PATCH"])
@jwt_required()
def update_me():
    identity = get_jwt_identity()
    try:
        identity = int(identity)
    except Exception:
        return jsonify({"error": "Invalid token identity"}), 401
    user = User.query.get(identity)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json() or {}
    email = data.get("email")
    first_name = data.get("first_name")
    last_name = data.get("last_name")

    if email:
        email = email.strip().lower()
        if not _validate_email(email):
            return jsonify({"error": "Invalid email format"}), 400
        # Check email not used by another user
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


@auth_bp.route("/me/password", methods=["PATCH"])
@jwt_required()
def change_password():
    identity = get_jwt_identity()
    try:
        identity = int(identity)
    except Exception:
        return jsonify({"error": "Invalid token identity"}), 401
    user = User.query.get(identity)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json() or {}
    current_password = data.get("current_password")
    new_password = data.get("new_password")

    if not current_password or not new_password:
        return jsonify({"error": "Missing password fields"}), 400

    if not user.check_password(current_password):
        return jsonify({"error": "Current password is incorrect"}), 401

    if not _validate_password(new_password):
        return (
            jsonify({"error": "New password must be at least 8 characters and include letters and numbers"}),
            400,
        )

    try:
        user.set_password(new_password)
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "Password updated successfully"}), 200
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500


@auth_bp.route("/me", methods=["DELETE"])
@jwt_required()
def delete_me():
    identity = get_jwt_identity()
    user = User.query.get(identity)
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500
