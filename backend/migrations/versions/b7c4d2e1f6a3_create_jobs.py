"""create jobs table

Revision ID: b7c4d2e1f6a3
Revises: 8f3b2a7c9d1e
Create Date: 2026-11-25 12:35:00.000000

"""
from alembic import context, op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b7c4d2e1f6a3'
down_revision = '8f3b2a7c9d1e'
branch_labels = None
depends_on = None


def upgrade():
    # Idempotent: skip if the table was already created outside Alembic.
    # Inspection is not possible in offline (--sql) mode.
    if not context.is_offline_mode() and sa.inspect(op.get_bind()).has_table('jobs'):
        return

    op.create_table(
        'jobs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('requirements', sa.Text(), nullable=True),
        sa.Column('location', sa.String(length=255), nullable=True),
        sa.Column('salary', sa.String(length=100), nullable=True),
        sa.Column('modality', sa.String(length=50), nullable=True),
        sa.Column('contract_type', sa.String(length=50), nullable=True),
        sa.Column('company_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], name='fk_jobs_company_id_companies'),
    )


def downgrade():
    op.drop_table('jobs')
