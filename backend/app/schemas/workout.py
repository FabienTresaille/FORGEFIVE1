from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional, List

class WorkoutSetBase(BaseModel):
    exercise_id: Optional[UUID] = None
    exercise_name: Optional[str] = None
    set_number: int = 1
    weight: Optional[float] = None
    reps: Optional[int] = None
    rpe: Optional[int] = None
    duration_seconds: Optional[int] = None
    distance_km: Optional[float] = None
    pace: Optional[str] = None

class WorkoutSetCreate(WorkoutSetBase):
    pass

class WorkoutSetResponse(BaseModel):
    id: UUID
    session_id: UUID
    exercise_id: UUID
    set_number: int
    weight: Optional[float] = None
    reps: Optional[int] = None
    rpe: Optional[int] = None
    duration_seconds: Optional[int] = None
    distance_km: Optional[float] = None
    pace: Optional[str] = None

    model_config = {"from_attributes": True}

class WorkoutSessionBase(BaseModel):
    date: Optional[datetime] = Field(default_factory=datetime.utcnow)
    duration_minutes: Optional[int] = None
    notes: Optional[str] = None
    rpe_global: Optional[int] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

class WorkoutSessionCreate(WorkoutSessionBase):
    title: Optional[str] = None
    routine_id: Optional[UUID] = None
    sets: Optional[List[WorkoutSetCreate]] = []

class WorkoutSessionUpdate(BaseModel):
    notes: Optional[str] = None
    duration_minutes: Optional[int] = None
    rpe_global: Optional[int] = None
    completed_at: Optional[datetime] = None

class WorkoutSessionResponse(WorkoutSessionBase):
    id: UUID
    user_id: UUID
    sets: List[WorkoutSetResponse] = []

    model_config = {"from_attributes": True}

class ExerciseRankResponse(BaseModel):
    id: UUID
    user_id: UUID
    exercise_id: UUID
    score: float
    rank_tier: str
    updated_at: datetime

    model_config = {"from_attributes": True}
