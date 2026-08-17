from pydantic import BaseModel
from uuid import UUID
from datetime import datetime, date
from typing import Optional

class StreakCounterResponse(BaseModel):
    current_streak: int
    best_streak: int
    last_workout_date: Optional[date] = None

    model_config = {"from_attributes": True}

class AchievementResponse(BaseModel):
    id: UUID
    code: str
    name: str
    description: str
    icon: Optional[str] = None

    model_config = {"from_attributes": True}

class UserAchievementResponse(BaseModel):
    id: UUID
    user_id: UUID
    achievement_id: UUID
    unlocked_at: datetime
    achievement: AchievementResponse

    model_config = {"from_attributes": True}
