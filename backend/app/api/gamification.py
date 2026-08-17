from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Any

from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.gamification import StreakCounter, Achievement, UserAchievement
from app.schemas.gamification import StreakCounterResponse, AchievementResponse, UserAchievementResponse

router = APIRouter()

@router.get("/streak", response_model=StreakCounterResponse)
async def get_streak(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(select(StreakCounter).filter(StreakCounter.user_id == current_user.id))
    streak = result.scalars().first()
    if not streak:
        streak = StreakCounter(user_id=current_user.id, current_streak=0, best_streak=0)
        db.add(streak)
        await db.commit()
        await db.refresh(streak)
    return streak

@router.get("/achievements", response_model=List[UserAchievementResponse])
async def get_achievements(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    # Dummy list of user achievements for now
    return []

@router.get("/attendance-ranking")
async def get_attendance_ranking(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    return []
