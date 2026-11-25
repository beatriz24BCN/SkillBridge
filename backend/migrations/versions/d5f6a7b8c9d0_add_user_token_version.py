"""add user token version

Revision ID: d5f6a7b8c9d0
Revises: c3d8e1f2a4b6
Create Date: 2026-11-25 14:10:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = "d5f6a7b8c9d0"
down_revision = "c3d8e1f2a4b6"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "users",
        sa.Column("token_version", sa.Integer(), server_default=sa.text("0"), nullable=False),
    )
    op.alter_column("users", "token_version", server_default=None)


def downgrade():
    op.drop_column("users", "token_version")
