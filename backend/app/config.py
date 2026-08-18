import os


class Config:
    """Application configuration.

    Note: `SQLALCHEMY_DATABASE_URI` must be provided via the `DATABASE_URL`
    environment variable in PostgreSQL URI format (e.g.
    `postgresql+psycopg://username:password@host:5432/dbname`).
    """
    # Read database URL from environment (do not fallback to SQLite)
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT secret key must be provided via environment variable. No default.
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    # Comma-separated origins
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173")


def validate_config():
    """Validate critical configuration values.

    This function raises a RuntimeError when required configuration is
    missing. It is not executed at import time so unit tests and static
    checks can import this module without requiring real credentials.
    Call this from the application factory when creating the app in
    non-test environments.
    """
    if not Config.SQLALCHEMY_DATABASE_URI:
        raise RuntimeError(
            "DATABASE_URL is not set. Set DATABASE_URL to a PostgreSQL URI. "
            "Example: postgresql+psycopg://username:password@localhost:5432/skillbridge"
        )
    # Require JWT secret key to be explicitly set via environment
    if not Config.JWT_SECRET_KEY:
        raise RuntimeError(
            "JWT_SECRET_KEY is not set. Set the JWT_SECRET_KEY environment variable with a secure secret."
        )
