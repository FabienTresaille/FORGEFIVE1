from pydantic import BaseModel
from uuid import UUID
from typing import Optional
from app.models.exercise import MuscleGroup, ExerciseType

class ExerciseBase(BaseModel):
    name: str
    muscle_group: MuscleGroup
    description: Optional[str] = None
    image_url: Optional[str] = None
    type: ExerciseType = ExerciseType.force

class ExerciseCreate(ExerciseBase):
    is_custom: bool = False

class ExerciseUpdate(BaseModel):
    name: Optional[str] = None
    muscle_group: Optional[MuscleGroup] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    type: Optional[ExerciseType] = None

class ExerciseResponse(ExerciseBase):
    id: UUID
    is_custom: bool
    created_by_user_id: Optional[UUID] = None

    model_config = {"from_attributes": True}
