import os
from flask import Flask, jsonify

from .config import Config, validate_config
from .extensions import db, migrate, jwt, cors


def create_app():
    app = Flask(__name__)

    # Load config
    app.config.from_object(Config)
    # Validate required configuration (DATABASE_URL and JWT_SECRET_KEY)
    validate_config()

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

    # Users routes (requires JWT)
    from .routes.users import users_bp

    app.register_blueprint(users_bp, url_prefix="/api/users")

    # Health check
    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok", "message": "SkillBridge API is running"})

    return app
