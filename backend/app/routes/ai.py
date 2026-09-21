from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..extensions import db
from ..models import User
from ..services.ai_service import generate_response


ai_bp = Blueprint("ai", __name__)


@ai_bp.route("/chat", methods=["POST"])
@jwt_required()
def chat():
    data = request.get_json() or {}
    message = (data.get("message") or "").strip()
    session_id = data.get("sessionId")

    if not message:
        return jsonify({"error": "message is required"}), 400

    identity = get_jwt_identity()
    try:
        user_id = int(identity)
    except Exception:
        return jsonify({"error": "Invalid token identity"}), 401

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        ai_resp = generate_response(user, message, session_id)
        return jsonify(ai_resp), 200
    except Exception:
        # Generic error handling without leaking internals
        return jsonify({"error": "Internal server error"}), 500
