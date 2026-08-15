from flask import Blueprint, jsonify, request

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    # TODO: implementar registro de usuario
    return (
        jsonify({"todo": "Implementar registro en /api/auth/register"}),
        501,
    )


@auth_bp.route("/login", methods=["POST"])
def login():
    # TODO: implementar login y generar JWT
    return (
        jsonify({"todo": "Implementar login en /api/auth/login"}),
        501,
    )


@auth_bp.route("/me", methods=["GET"])
def me():
    # TODO: devolver información del usuario autenticado usando JWT
    return (
        jsonify({"todo": "Implementar /api/auth/me (protegido con JWT)"}),
        501,
    )
