import uuid
from datetime import datetime, date
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Date, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class RecoveryEntry(Base):
    __tablename__ = "recovery_entries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    date = Column(Date, default=date.today, nullable=False)
    sleep_hours = Column(Integer, nullable=False)
    sleep_quality = Column(Integer, nullable=False)
    soreness_level = Column(Integer, nullable=False)
    energy_level = Column(Integer, nullable=False)
    free_note = Column(String, nullable=True)
    ai_recommendation = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint('user_id', 'date', name='uq_user_date_recovery'),
    )
