from datetime import datetime

from ..extensions import db


class Company(db.Model):
    __tablename__ = "companies"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    email = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(50), nullable=True)
    website = db.Column(db.String(255), nullable=True)
    location = db.Column(db.String(255), nullable=True)
    logo = db.Column(db.String(512), nullable=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, **kwargs):
        # Normalize name by stripping surrounding whitespace when provided
        if "name" in kwargs and kwargs["name"] is not None:
            try:
                kwargs["name"] = kwargs["name"].strip()
            except Exception:
                # If it's not a string, leave it to SQLAlchemy/type checks later
                pass
        super().__init__(**kwargs)

    def to_dict(self, include_owner: bool = False) -> dict:
        data = {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "email": self.email,
            "phone": self.phone,
            "website": self.website,
            "location": self.location,
            "logo": self.logo,
            "owner_id": self.owner_id,
            "created_at": None if not self.created_at else self.created_at.isoformat(),
            "updated_at": None if not self.updated_at else self.updated_at.isoformat(),
        }

        if include_owner:
            # Include minimal, safe owner info — do NOT expose sensitive fields
            owner = None
            try:
                if hasattr(self, "owner") and self.owner is not None:
                    owner = {
                        "id": self.owner.id,
                        "email": self.owner.email,
                        "first_name": self.owner.first_name,
                        "last_name": self.owner.last_name,
                    }
            except Exception:
                owner = None

            data["owner"] = owner

        return data

    def __repr__(self):
        return f"<Company {self.name} ({self.id})>"
