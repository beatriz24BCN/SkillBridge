"""prevent duplicate applications

Revision ID: e7a9b2c4d6f1
Revises: d5f6a7b8c9d0
Create Date: 2026-11-25 14:15:00.000000

"""
from alembic import op


revision = "e7a9b2c4d6f1"
down_revision = "d5f6a7b8c9d0"
branch_labels = None
depends_on = None


def upgrade():
    op.create_unique_constraint(
        "uq_applications_user_job",
        "applications",
        ["user_id", "job_id"],
    )


def downgrade():
    op.drop_constraint("uq_applications_user_job", "applications", type_="unique")
