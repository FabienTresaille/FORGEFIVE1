from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc, func
from typing import List, Any
import uuid
from datetime import datetime, timedelta

from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.workout import ExerciseRank, WorkoutSet, WorkoutSession
from app.models.exercise import Exercise
from app.schemas.workout import ExerciseRankResponse

router = APIRouter()

@router.get("/me", response_model=List[ExerciseRankResponse])
async def get_my_rankings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(select(ExerciseRank).filter(ExerciseRank.user_id == current_user.id))
    return result.scalars().all()

@router.get("/group")
async def get_group_rankings(
    exercise_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    query = (
        select(ExerciseRank, User.display_name)
        .join(User, User.id == ExerciseRank.user_id)
        .filter(ExerciseRank.exercise_id == exercise_id)
        .order_by(desc(ExerciseRank.score))
    )
    result = await db.execute(query)
    rankings = []
    for pos, row in enumerate(result.all()):
        rank, display_name = row
        rankings.append({
            "display_name": display_name,
            "score": rank.score,
            "rank_tier": rank.rank_tier,
            "position": pos + 1
        })
    return rankings

@router.get("/bodygraph")
async def get_bodygraph(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    fourteen_days_ago = datetime.utcnow() - timedelta(days=14)
    query = (
        select(Exercise.muscle_group, func.sum(WorkoutSet.weight * WorkoutSet.reps))
        .join(WorkoutSet, WorkoutSet.exercise_id == Exercise.id)
        .join(WorkoutSession, WorkoutSession.id == WorkoutSet.session_id)
        .filter(WorkoutSession.user_id == current_user.id)
        .filter(WorkoutSession.date >= fourteen_days_ago)
        .filter(WorkoutSet.weight.is_not(None), WorkoutSet.reps.is_not(None))
        .group_by(Exercise.muscle_group)
    )
    result = await db.execute(query)
    data = {}
    for row in result.all():
        muscle = row[0].value if hasattr(row[0], 'value') else row[0]
        data[muscle] = float(row[1] or 0)
    return {"data": data}
