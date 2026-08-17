from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Any
import uuid

from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.coach import CoachConversation, CoachMessage
from app.schemas.coach import CoachConversationResponse, CoachChatRequest, CoachMessageResponse
from app.services import coach_service

router = APIRouter()

@router.get("/conversations", response_model=List[CoachConversationResponse])
async def list_conversations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(
        select(CoachConversation).options(selectinload(CoachConversation.messages)).filter(CoachConversation.user_id == current_user.id).order_by(CoachConversation.updated_at.desc())
    )
    return result.scalars().all()

@router.get("/conversations/{conversation_id}", response_model=CoachConversationResponse)
async def get_conversation(
    conversation_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(
        select(CoachConversation).options(selectinload(CoachConversation.messages)).filter(CoachConversation.id == conversation_id, CoachConversation.user_id == current_user.id)
    )
    conv = result.scalars().first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conv

@router.post("/chat", response_model=CoachMessageResponse)
async def chat_with_coach(
    data: CoachChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    ai_msg = await coach_service.get_coach_response(db, current_user, data.message, data.conversation_id)
    return ai_msg

@router.post("/analyze-workout/{session_id}")
async def analyze_workout(
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    return await coach_service.analyze_workout_session(db, current_user, session_id)

@router.get("/daily-tip")
async def get_daily_tip(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    return await coach_service.get_daily_tip(db, current_user)
