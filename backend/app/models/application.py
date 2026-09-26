from datetime import datetime

from ..extensions import db


class Application(db.Model):
    __tablename__ = "applications"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey("jobs.id"), nullable=False)
    status = db.Column(db.String(32), nullable=False, default="pending")
    cover_letter = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    ALLOWED_STATUSES = {"pending", "accepted", "rejected"}

    def __init__(self, **kwargs):
        # Normalize and validate status
        status = kwargs.get("status") or "pending"
        if status not in self.ALLOWED_STATUSES:
            raise ValueError("Invalid status")
        kwargs["status"] = status

        if "user_id" not in kwargs or not kwargs.get("user_id"):
            raise ValueError("user_id is required")
        if "job_id" not in kwargs or not kwargs.get("job_id"):
            raise ValueError("job_id is required")

        super().__init__(**kwargs)

    def to_dict(self, include_job: bool = True, include_user: bool = False) -> dict:
        data = {
            "id": self.id,
            "user_id": self.user_id,
            "job_id": self.job_id,
            "status": self.status,
            "cover_letter": self.cover_letter,
            "created_at": None if not self.created_at else self.created_at.isoformat(),
            "updated_at": None if not self.updated_at else self.updated_at.isoformat(),
        }

        if include_job:
            try:
                j = None
                if hasattr(self, "job_ref") and self.job_ref is not None:
                    j = self.job_ref.to_dict(include_company=True)
                data["job"] = j
            except Exception:
                data["job"] = None

        if include_user:
            try:
                u = None
                if hasattr(self, "applicant") and self.applicant is not None:
                    u = self.applicant.to_dict()
                data["user"] = u
            except Exception:
                data["user"] = None

        return data

    def __repr__(self):
        return f"<Application {self.id} user={self.user_id} job={self.job_id}>"
