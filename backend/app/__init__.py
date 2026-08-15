import os
from flask import Flask, jsonify

from .config import Config
from .extensions import db, migrate, jwt, cors


def create_app():
    app = Flask(__name__)

    # Load config
    app.config.from_object(Config)

    # Require DATABASE_URL to be set
    if not app.config.get("SQLALCHEMY_DATABASE_URI"):
        raise RuntimeError(
            "DATABASE_URL no está configurada. Define la variable de entorno DATABASE_URL."
        )

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Configure CORS
    origins = []
    cors_origins = app.config.get("CORS_ORIGINS")
    if cors_origins:
        origins = [o.strip() for o in cors_origins.split(",") if o.strip()]
    cors.init_app(app, resources={r"/api/*": {"origins": origins}})

    # Register blueprints
    from .routes.auth import auth_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    # Health check
    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok", "message": "SkillBridge API is running"})

    return app
