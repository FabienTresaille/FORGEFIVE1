from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    display_name: str
    role: str = "user"

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None

class OnboardingRequest(BaseModel):
    weight_kg: float
    height_cm: float
    goal: str
    weekly_frequency: int
    session_duration_minutes: int

class ProfileUpdateRequest(BaseModel):
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    goal: Optional[str] = None
    weekly_frequency: Optional[int] = None
    session_duration_minutes: Optional[int] = None

class UserResponse(UserBase):
    id: UUID
    is_active: bool
    must_change_password: bool
    created_at: datetime
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    goal: Optional[str] = None
    weekly_frequency: Optional[int] = None
    session_duration_minutes: Optional[int] = None
    onboarding_completed: bool

    model_config = {"from_attributes": True}
