import uuid
from sqlalchemy import Column, String, Boolean, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import enum

class MuscleGroup(str, enum.Enum):
    pectoraux = "pectoraux"
    dos = "dos"
    jambes = "jambes"
    epaules = "epaules"
    bras = "bras"
    core = "core"
    cardio = "cardio"
    full_body = "full_body"

class ExerciseType(str, enum.Enum):
    force = "force"
    cardio = "cardio"

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    muscle_group = Column(Enum(MuscleGroup), nullable=False)
    description = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    is_custom = Column(Boolean, default=False, nullable=False)
    created_by_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    type = Column(Enum(ExerciseType), default=ExerciseType.force, nullable=False)
