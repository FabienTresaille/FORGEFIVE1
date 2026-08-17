from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional, List

class RoutineExerciseBase(BaseModel):
    exercise_id: UUID
    order: int
    target_sets: Optional[int] = None
    target_reps: Optional[int] = None
    target_weight: Optional[float] = None

class RoutineExerciseCreate(RoutineExerciseBase):
    pass

class RoutineExerciseResponse(RoutineExerciseBase):
    id: UUID
    routine_id: UUID

    model_config = {"from_attributes": True}

class RoutineBase(BaseModel):
    name: str
    description: Optional[str] = None

class RoutineCreate(RoutineBase):
    exercises: List[RoutineExerciseCreate]

class RoutineUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    exercises: Optional[List[RoutineExerciseCreate]] = None

class RoutineResponse(RoutineBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    exercises: List[RoutineExerciseResponse]

    model_config = {"from_attributes": True}
