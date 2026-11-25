import re
from datetime import datetime, timedelta

from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
)

from ..extensions import db
from ..models.user import User
from ..models.password_reset import PasswordResetToken
from ..extensions import limiter


auth_bp = Blueprint("auth", __name__)


def _validate_email(email: str) -> bool:
    if not isinstance(email, str) or not email:
        return False
    email = email.strip().lower()
    # Basic email pattern
    return re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email) is not None


def _validate_password(password: str) -> bool:
    if not isinstance(password, str) or not password or len(password) < 8:
        return False
    # At least one letter and one digit
    return re.search(r"[A-Za-z]", password) and re.search(r"\d", password)


def _create_access_token(user):
    return create_access_token(
        identity=str(user.id),
        additional_claims={"token_version": user.token_version},
    )


def _json_body():
    data = request.get_json(silent=True)
    return data if isinstance(data, dict) else {}


@auth_bp.route("/register", methods=["POST"])
def register():
    data = _json_body()
    raw_email = data.get("email")
    email = raw_email.strip().lower() if isinstance(raw_email, str) else ""
    password = data.get("password")
    raw_first_name = data.get("first_name")
    raw_last_name = data.get("last_name")
    first_name = raw_first_name.strip() if isinstance(raw_first_name, str) else ""
    last_name = raw_last_name.strip() if isinstance(raw_last_name, str) else ""

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
        access_token = _create_access_token(user)
        return jsonify({
            "message": "User registered successfully",
            "access_token": access_token,
            "user": user.to_dict(),
        }), 201
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500


@auth_bp.route("/login", methods=["POST"])
@limiter.limit("10 per minute")
def login():
    data = _json_body()
    raw_email = data.get("email")
    email = raw_email.strip().lower() if isinstance(raw_email, str) else ""
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = _create_access_token(user)

    return jsonify(
        {
            "access_token": access_token,
            "user": user.to_dict(),
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
    user = db.session.get(User, identity)
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
    user = db.session.get(User, identity)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = _json_body()
    email = data.get("email")
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    phone = data.get("phone")
    location = data.get("location")
    skills = data.get("skills")
    experience = data.get("experience")
    preferences = data.get("preferences")

    if email:
        if not isinstance(email, str):
            return jsonify({"error": "Invalid email format"}), 400
        email = email.strip().lower()
        if not _validate_email(email):
            return jsonify({"error": "Invalid email format"}), 400
        # Check email not used by another user
        other = User.query.filter(User.email == email, User.id != user.id).first()
        if other:
            return jsonify({"error": "Email already registered"}), 409
        user.email = email

    if first_name is not None:
        if not isinstance(first_name, str):
            return jsonify({"error": "first_name must be a string"}), 400
        user.first_name = first_name.strip()

    if last_name is not None:
        if not isinstance(last_name, str):
            return jsonify({"error": "last_name must be a string"}), 400
        user.last_name = last_name.strip()
    if phone is not None:
        if not isinstance(phone, str):
            return jsonify({"error": "phone must be a string"}), 400
        user.phone = phone.strip()[:50] or None
    if location is not None:
        if not isinstance(location, str):
            return jsonify({"error": "location must be a string"}), 400
        user.location = location.strip()[:255] or None
    if skills is not None:
        if not isinstance(skills, list) or any(not isinstance(skill, str) or not skill.strip() for skill in skills):
            return jsonify({"error": "Skills must be a list of non-empty strings"}), 400
        user.skills = list(dict.fromkeys(skill.strip()[:80] for skill in skills))[:50]
    if experience is not None:
        if not isinstance(experience, list):
            return jsonify({"error": "Experience must be a list"}), 400
        normalized = []
        for item in experience:
            if not isinstance(item, dict):
                return jsonify({"error": "Invalid experience entry"}), 400
            entry = {
                key: str(item.get(key) or "").strip()[:2000]
                for key in ("company", "position", "start", "end", "description")
            }
            if not entry["company"] or not entry["position"]:
                return jsonify({"error": "Company and position are required for experience"}), 400
            normalized.append(entry)
        user.experience = normalized[:50]
    if preferences is not None:
        if not isinstance(preferences, dict):
            return jsonify({"error": "Preferences must be an object"}), 400
        current = user.preferences or {}
        boolean_keys = ("job_alerts", "application_updates", "profile_public", "remote_only")
        for key in boolean_keys:
            if key in preferences and not isinstance(preferences[key], bool):
                return jsonify({"error": f"{key} must be a boolean"}), 400
        if "preferred_location" in preferences and not isinstance(preferences["preferred_location"], str):
            return jsonify({"error": "preferred_location must be a string"}), 400
        user.preferences = {
            "job_alerts": preferences.get("job_alerts", bool(current.get("job_alerts", True))),
            "application_updates": preferences.get("application_updates", bool(current.get("application_updates", True))),
            "profile_public": preferences.get("profile_public", bool(current.get("profile_public", False))),
            "remote_only": preferences.get("remote_only", bool(current.get("remote_only", False))),
            "preferred_location": str(preferences.get("preferred_location", current.get("preferred_location", ""))).strip()[:255],
        }

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
    user = db.session.get(User, identity)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = _json_body()
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
        user.token_version += 1
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "Password updated successfully"}), 200
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500


@auth_bp.route("/password/forgot", methods=["POST"])
def forgot_password():
    data = _json_body()
    raw_email = data.get("email")
    email = raw_email.strip().lower() if isinstance(raw_email, str) else ""
    if email and _validate_email(email):
        user = User.query.filter_by(email=email).first()
        if user:
            now = datetime.utcnow()
            PasswordResetToken.query.filter_by(user_id=user.id, used_at=None).delete()
            token, reset = PasswordResetToken.create_for_user(user.id, now + timedelta(minutes=30))
            db.session.add(reset)
            db.session.commit()
            # Email delivery is intentionally not simulated. The provider integration
            # should deliver this raw token using the configured reset URL.
            del token
    return jsonify({
        "message": "If the email is registered, password reset instructions will be sent.",
    }), 202


@auth_bp.route("/password/reset", methods=["POST"])
def reset_password():
    data = _json_body()
    token = data.get("token")
    password = data.get("password")
    if not isinstance(token, str) or not token or not isinstance(password, str) or not password:
        return jsonify({"error": "Token and password are required"}), 400
    if not _validate_password(password):
        return jsonify({
            "error": "Password must be at least 8 characters and include letters and numbers",
        }), 400

    reset = PasswordResetToken.query.filter_by(token_hash=PasswordResetToken.hash_token(token)).first()
    now = datetime.utcnow()
    if not reset or not reset.is_valid(now):
        return jsonify({"error": "Invalid or expired reset token"}), 400

    try:
        user = db.session.get(User, reset.user_id)
        if not user:
            return jsonify({"error": "Invalid or expired reset token"}), 400
        user.set_password(password)
        user.token_version += 1
        reset.used_at = now
        db.session.commit()
        return jsonify({"message": "Password updated successfully"}), 200
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500


@auth_bp.route("/me", methods=["DELETE"])
@jwt_required()
def delete_me():
    identity = get_jwt_identity()
    user = db.session.get(User, identity)
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500
