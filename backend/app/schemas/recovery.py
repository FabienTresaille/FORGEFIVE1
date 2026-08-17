from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime, date
from typing import Optional

class RecoveryEntryBase(BaseModel):
    date: date
    sleep_hours: int = Field(ge=0, le=24)
    sleep_quality: int = Field(ge=1, le=5)
    soreness_level: int = Field(ge=1, le=5)
    energy_level: int = Field(ge=1, le=5)
    free_note: Optional[str] = None

class RecoveryEntryCreate(RecoveryEntryBase):
    pass

class RecoveryEntryResponse(RecoveryEntryBase):
    id: UUID
    user_id: UUID
    ai_recommendation: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
