from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import List

class CoachMessageBase(BaseModel):
    role: str
    content: str

class CoachMessageCreate(CoachMessageBase):
    pass

class CoachMessageResponse(CoachMessageBase):
    id: UUID
    conversation_id: UUID
    created_at: datetime

    model_config = {"from_attributes": True}

class CoachConversationBase(BaseModel):
    title: str

class CoachConversationCreate(CoachConversationBase):
    pass

class CoachConversationResponse(CoachConversationBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    messages: List[CoachMessageResponse] = []

    model_config = {"from_attributes": True}

class CoachChatRequest(BaseModel):
    message: str
    conversation_id: Optional[UUID] = None
