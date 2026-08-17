from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional, Dict, Any, List

class ActivityCommentBase(BaseModel):
    content: str

class ActivityCommentCreate(ActivityCommentBase):
    pass

class ActivityCommentResponse(ActivityCommentBase):
    id: UUID
    post_id: UUID
    user_id: UUID
    created_at: datetime

    model_config = {"from_attributes": True}

class ActivityPostBase(BaseModel):
    workout_session_id: UUID
    summary: Optional[str] = None
    bodygraph_data: Optional[Dict[str, Any]] = None

class ActivityPostCreate(ActivityPostBase):
    pass

class ActivityPostResponse(ActivityPostBase):
    id: UUID
    user_id: UUID
    published_at: datetime
    likes_count: int = 0
    comments: List[ActivityCommentResponse] = []

    model_config = {"from_attributes": True}
