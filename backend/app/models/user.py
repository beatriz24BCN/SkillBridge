from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.dialects.postgresql import JSONB

from ..extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(120), nullable=True)
    last_name = db.Column(db.String(120), nullable=True)
    phone = db.Column(db.String(50), nullable=True)
    location = db.Column(db.String(255), nullable=True)
    skills = db.Column(JSONB, nullable=False, default=list)
    experience = db.Column(JSONB, nullable=False, default=list)
    preferences = db.Column(JSONB, nullable=False, default=dict)
    token_version = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    # One-to-many relationship: a user can own multiple companies
    companies = db.relationship("Company", backref="owner", lazy="dynamic")
    # One-to-many relationship: a user can have multiple applications
    applications = db.relationship("Application", backref="applicant", lazy="dynamic")
    saved_jobs = db.relationship("SavedJob", backref="user", lazy="dynamic", cascade="all, delete-orphan")
    password_resets = db.relationship("PasswordResetToken", backref="user", lazy="dynamic", cascade="all, delete-orphan")

    DEFAULT_PREFERENCES = {
        "job_alerts": True,
        "application_updates": True,
        "profile_public": False,
        "remote_only": False,
        "preferred_location": "",
    }

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self, include_updated: bool = True, include_private: bool = True) -> dict:
        """Serialize the user for public API responses.

        Never include sensitive fields such as `password_hash`.
        """
        data = {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone": self.phone,
            "location": self.location,
            "skills": self.skills or [],
            "experience": self.experience or [],
            "created_at": None if not self.created_at else self.created_at.isoformat(),
        }
        if include_private:
            data["preferences"] = {**self.DEFAULT_PREFERENCES, **(self.preferences or {})}
        if include_updated:
            data["updated_at"] = None if not self.updated_at else self.updated_at.isoformat()
        return data

    def to_public_dict(self) -> dict:
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "skills": self.skills or [],
            "experience": self.experience or [],
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f"<User {self.email}>"
