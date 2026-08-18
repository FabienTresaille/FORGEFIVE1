"""Add user profile fields

Revision ID: 002_add_user_profile_fields
Revises: 001_initial
Create Date: 2026-08-18 21:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = '002_add_user_profile_fields'
down_revision = '001_initial'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('users', sa.Column('weight_kg', sa.Float(), nullable=True))
    op.add_column('users', sa.Column('height_cm', sa.Float(), nullable=True))
    op.add_column('users', sa.Column('goal', sa.String(), nullable=True))
    op.add_column('users', sa.Column('weekly_frequency', sa.Integer(), nullable=True))
    op.add_column('users', sa.Column('session_duration_minutes', sa.Integer(), nullable=True))
    op.add_column('users', sa.Column('onboarding_completed', sa.Boolean(), server_default='false', nullable=False))


def downgrade() -> None:
    op.drop_column('users', 'onboarding_completed')
    op.drop_column('users', 'session_duration_minutes')
    op.drop_column('users', 'weekly_frequency')
    op.drop_column('users', 'goal')
    op.drop_column('users', 'height_cm')
    op.drop_column('users', 'weight_kg')
