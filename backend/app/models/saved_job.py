from datetime import datetime

from ..extensions import db


class SavedJob(db.Model):
    __tablename__ = "saved_jobs"
    __table_args__ = (
        db.UniqueConstraint("user_id", "job_id", name="uq_saved_jobs_user_job"),
    )

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    job_id = db.Column(db.Integer, db.ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    job = db.relationship("Job")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "job_id": self.job_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "job": self.job.to_dict(include_company=True),
        }

