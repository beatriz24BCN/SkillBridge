from datetime import datetime
import hashlib
import secrets

from ..extensions import db


class PasswordResetToken(db.Model):
    __tablename__ = "password_reset_tokens"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    token_hash = db.Column(db.String(64), nullable=False, unique=True, index=True)
    expires_at = db.Column(db.DateTime, nullable=False)
    used_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    @staticmethod
    def hash_token(token):
        return hashlib.sha256(token.encode("utf-8")).hexdigest()

    @classmethod
    def create_for_user(cls, user_id, expires_at):
        token = secrets.token_urlsafe(48)
        return token, cls(
            user_id=user_id,
            token_hash=cls.hash_token(token),
            expires_at=expires_at,
        )

    def is_valid(self, now):
        return self.used_at is None and self.expires_at > now

