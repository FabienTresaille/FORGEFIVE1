from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Any
from datetime import date

from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.recovery import RecoveryEntry
from app.schemas.recovery import RecoveryEntryResponse, RecoveryEntryCreate
from sqlalchemy.exc import IntegrityError
from app.services import recovery_service

router = APIRouter()

@router.post("", response_model=RecoveryEntryResponse)
async def create_recovery_entry(
    data: RecoveryEntryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    entry = RecoveryEntry(user_id=current_user.id, **data.model_dump())
    db.add(entry)
    try:
        await db.commit()
        
        # Generate AI recommendation
        try:
            recommendation = await recovery_service.generate_recovery_recommendation(db, current_user)
            entry.ai_recommendation = recommendation
            await db.commit()
        except Exception:
            pass # ignore if AI generation fails
            
        await db.refresh(entry)
        return entry
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Entry for this date already exists")

@router.get("/today", response_model=RecoveryEntryResponse)
async def get_today_recovery(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(select(RecoveryEntry).filter(RecoveryEntry.user_id == current_user.id, RecoveryEntry.date == date.today()))
    entry = result.scalars().first()
    if not entry:
        raise HTTPException(status_code=404, detail="No recovery entry for today")
    return entry

@router.get("/history", response_model=List[RecoveryEntryResponse])
async def get_recovery_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(select(RecoveryEntry).filter(RecoveryEntry.user_id == current_user.id).order_by(RecoveryEntry.date.desc()))
    return result.scalars().all()
