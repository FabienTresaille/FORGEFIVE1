from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
import uuid
from app.models.workout import WorkoutSession, WorkoutSet
from app.models.exercise import Exercise

async def generate_activity_summary(db: AsyncSession, session_id: uuid.UUID) -> str:
    res = await db.execute(
        select(WorkoutSession)
        .filter(WorkoutSession.id == session_id)
    )
    session = res.scalars().first()
    if not session:
        return "Séance d'entraînement."
        
    query = (
        select(func.count(WorkoutSet.id), func.sum(WorkoutSet.weight * WorkoutSet.reps))
        .filter(WorkoutSet.session_id == session_id)
    )
    res_stats = await db.execute(query)
    sets_count, total_vol = res_stats.first()
    
    vol_str = f"Volume total: {total_vol or 0}kg."
    return f"Séance complétée avec {sets_count or 0} séries. {vol_str}"

async def generate_bodygraph_data(db: AsyncSession, session_id: uuid.UUID) -> dict:
    query = (
        select(Exercise.muscle_group, func.sum(WorkoutSet.weight * WorkoutSet.reps))
        .join(WorkoutSet, WorkoutSet.exercise_id == Exercise.id)
        .filter(WorkoutSet.session_id == session_id)
        .filter(WorkoutSet.weight.is_not(None), WorkoutSet.reps.is_not(None))
        .group_by(Exercise.muscle_group)
    )
    res = await db.execute(query)
    data = {}
    for row in res.all():
        muscle = row[0].value if hasattr(row[0], 'value') else row[0]
        data[muscle] = float(row[1] or 0)
    return data
