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

    # Normalize JWT errors to JSON 401 responses so malformed/invalid
    # tokens return 401 instead of 422 (pyjwt message leakage).
    @jwt.unauthorized_loader
    def _unauthorized_callback(err):
        return jsonify({"error": err}), 401

    @jwt.invalid_token_loader
    def _invalid_token_callback(err):
        return jsonify({"error": err}), 401

    @jwt.expired_token_loader
    def _expired_token_callback(jwt_header, jwt_payload):
        return jsonify({"error": "Token has expired"}), 401

    @jwt.revoked_token_loader
    def _revoked_token_callback(jwt_header, jwt_payload):
        return jsonify({"error": "Token has been revoked"}), 401

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

    # Jobs routes
    from .routes.jobs import jobs_bp
    app.register_blueprint(jobs_bp, url_prefix="/api/jobs")

    # Companies routes
    from .routes.companies import companies_bp
    app.register_blueprint(companies_bp, url_prefix="/api/companies")

    # AI Assistant routes
    from .routes.ai import ai_bp
    app.register_blueprint(ai_bp, url_prefix="/api/ai")

    # Health check
    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok", "message": "SkillBridge API is running"})

    return app
