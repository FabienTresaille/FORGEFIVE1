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
from app.services import recovery_service

router = APIRouter()

@router.post("", response_model=RecoveryEntryResponse)
async def create_or_update_recovery_entry(
    data: RecoveryEntryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    target_date = data.date or date.today()
    result = await db.execute(
        select(RecoveryEntry).filter(
            RecoveryEntry.user_id == current_user.id,
            RecoveryEntry.date == target_date
        )
    )
    entry = result.scalars().first()
    
    data_dict = data.model_dump(exclude_unset=True)
    data_dict["date"] = target_date
    if "sleep_hours" not in data_dict or data_dict["sleep_hours"] is None:
        data_dict["sleep_hours"] = 8

    if entry:
        for k, v in data_dict.items():
            setattr(entry, k, v)
    else:
        entry = RecoveryEntry(user_id=current_user.id, **data_dict)
        db.add(entry)

    await db.commit()
    
    # Generate AI recommendation
    try:
        recommendation = await recovery_service.generate_recovery_recommendation(db, current_user)
        entry.ai_recommendation = recommendation
        await db.commit()
    except Exception:
        pass
        
    await db.refresh(entry)
    return entry

@router.get("/today", response_model=RecoveryEntryResponse)
async def get_today_recovery(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(
        select(RecoveryEntry).filter(
            RecoveryEntry.user_id == current_user.id,
            RecoveryEntry.date == date.today()
        )
    )
    entry = result.scalars().first()
    if not entry:
        raise HTTPException(status_code=404, detail="No recovery entry for today")
    return entry

@router.get("/history", response_model=List[RecoveryEntryResponse])
async def get_recovery_history(
    days: int = 30,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(
        select(RecoveryEntry)
        .filter(RecoveryEntry.user_id == current_user.id)
        .order_by(RecoveryEntry.date.desc())
        .limit(days)
    )
    return result.scalars().all()
