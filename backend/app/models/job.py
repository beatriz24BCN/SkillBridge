from datetime import datetime

from ..extensions import db


class Job(db.Model):
    __tablename__ = "jobs"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    requirements = db.Column(db.Text, nullable=True)
    location = db.Column(db.String(255), nullable=True)
    salary = db.Column(db.String(100), nullable=True)
    modality = db.Column(db.String(50), nullable=True)
    contract_type = db.Column(db.String(50), nullable=True)
    company_id = db.Column(db.Integer, db.ForeignKey("companies.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, **kwargs):
        # Basic validation and normalization
        if "title" in kwargs and kwargs["title"] is not None:
            try:
                kwargs["title"] = kwargs["title"].strip()
            except Exception:
                pass

        if "description" in kwargs and kwargs["description"] is not None:
            try:
                kwargs["description"] = kwargs["description"].strip()
            except Exception:
                pass

        # Required fields
        if "title" not in kwargs or kwargs.get("title") is None or str(kwargs.get("title")).strip() == "":
            raise ValueError("title is required")

        if "description" not in kwargs or kwargs.get("description") is None or str(kwargs.get("description")).strip() == "":
            raise ValueError("description is required")

        if "company_id" not in kwargs or kwargs.get("company_id") is None:
            raise ValueError("company_id is required")

        super().__init__(**kwargs)

    def to_dict(self, include_company: bool = False) -> dict:
        data = {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "requirements": self.requirements,
            "location": self.location,
            "salary": self.salary,
            "modality": self.modality,
            "contract_type": self.contract_type,
            "company_id": self.company_id,
            "created_at": None if not self.created_at else self.created_at.isoformat(),
            "updated_at": None if not self.updated_at else self.updated_at.isoformat(),
        }

        if include_company:
            try:
                comp = None
                if hasattr(self, "company") and self.company is not None:
                    comp = {
                        "id": self.company.id,
                        "name": self.company.name,
                        "location": self.company.location,
                        "website": self.company.website,
                    }
                data["company"] = comp
            except Exception:
                data["company"] = None

        return data

    def __repr__(self):
        return f"<Job {self.title} ({self.id})>"
