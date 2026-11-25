import math
import os
from urllib.parse import urlsplit

from dotenv import load_dotenv

# Load .env into environment early so Config can read DATABASE_URL when
# the application or Flask CLI (flask) imports the config module.
load_dotenv()


def _env_int(name, default):
    value = os.getenv(name)
    if value is None:
        return default
    try:
        return int(value)
    except ValueError as exc:
        raise RuntimeError(f"{name} must be an integer") from exc


def _env_bool(name, default=False):
    value = os.getenv(name)
    if value is None:
        return default
    normalized = value.strip().lower()
    if normalized in {"1", "true", "yes", "on"}:
        return True
    if normalized in {"0", "false", "no", "off"}:
        return False
    raise RuntimeError(f"{name} must be a boolean")


def _env_float(name, default):
    value = os.getenv(name)
    if value is None:
        return default
    try:
        parsed = float(value)
    except ValueError as exc:
        raise RuntimeError(f"{name} must be a number") from exc
    if not math.isfinite(parsed):
        raise RuntimeError(f"{name} must be a finite number")
    return parsed


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
    JWT_ACCESS_TOKEN_EXPIRES = _env_int("JWT_ACCESS_TOKEN_EXPIRES", 900)

    # Comma-separated origins
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173")
    RATELIMIT_STORAGE_URI = os.getenv("RATELIMIT_STORAGE_URI", "memory://")
    RATELIMIT_STORAGE_OPTIONS = {
        "wrap_exceptions": True,
        "socket_connect_timeout": _env_float("RATELIMIT_CONNECT_TIMEOUT", 2.0),
        "socket_timeout": _env_float("RATELIMIT_SOCKET_TIMEOUT", 2.0),
    }
    RATELIMIT_SWALLOW_ERRORS = False
    ENVIRONMENT = os.getenv("APP_ENV", "development").strip().lower()
    BREVO_EMAIL_ENABLED = _env_bool("BREVO_EMAIL_ENABLED", False)
    BREVO_API_KEY = os.getenv("BREVO_API_KEY")
    BREVO_API_URL = os.getenv("BREVO_API_URL", "https://api.brevo.com/v3/smtp/email")
    BREVO_SENDER_EMAIL = os.getenv("BREVO_SENDER_EMAIL")
    BREVO_SENDER_NAME = os.getenv("BREVO_SENDER_NAME", "SkillBridge")
    FRONTEND_URL = os.getenv("FRONTEND_URL")
    BREVO_TIMEOUT = _env_int("BREVO_TIMEOUT", 10)



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
    if Config.ENVIRONMENT == "production" and Config.RATELIMIT_STORAGE_URI.startswith("memory://"):
        raise RuntimeError(
            "Production requires RATELIMIT_STORAGE_URI to use shared storage, for example redis://redis:6379/0."
        )
    if any(
        timeout <= 0
        for timeout in (
            Config.RATELIMIT_STORAGE_OPTIONS["socket_connect_timeout"],
            Config.RATELIMIT_STORAGE_OPTIONS["socket_timeout"],
        )
    ):
        raise RuntimeError("Redis rate-limit timeouts must be greater than zero")
    if Config.BREVO_EMAIL_ENABLED:
        missing = [
            name for name, value in (
                ("BREVO_API_KEY", Config.BREVO_API_KEY),
                ("BREVO_SENDER_EMAIL", Config.BREVO_SENDER_EMAIL),
                ("FRONTEND_URL", Config.FRONTEND_URL),
            )
            if not value
        ]
        if missing:
            raise RuntimeError(f"Brevo email is enabled but missing: {', '.join(missing)}")
        if Config.BREVO_TIMEOUT <= 0:
            raise RuntimeError("BREVO_TIMEOUT must be greater than zero")
        frontend_url = urlsplit(Config.FRONTEND_URL)
        if frontend_url.scheme not in {"http", "https"} or not frontend_url.netloc:
            raise RuntimeError("FRONTEND_URL must be an absolute HTTP(S) URL")
        if Config.ENVIRONMENT == "production" and frontend_url.scheme != "https":
            raise RuntimeError("Production requires FRONTEND_URL to use HTTPS")
