from flask import Blueprint

bp = Blueprint("api", __name__)

from .jobs import jobs_bp  # noqa: E402
