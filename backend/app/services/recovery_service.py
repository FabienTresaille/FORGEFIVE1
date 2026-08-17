from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc, func
from datetime import datetime, timedelta
from app.models.user import User
from app.models.recovery import RecoveryEntry
from app.models.workout import WorkoutSession, WorkoutSet
from app.models.exercise import Exercise
from app.services.gemini_client import GeminiClient

async def generate_recovery_recommendation(db: AsyncSession, user: User):
    res_recov = await db.execute(
        select(RecoveryEntry)
        .filter(RecoveryEntry.user_id == user.id)
        .order_by(desc(RecoveryEntry.date))
        .limit(1)
    )
    latest_recov = res_recov.scalars().first()
    if not latest_recov:
        return "Aucune donnée de récupération disponible."
        
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    query = (
        select(Exercise.muscle_group, func.sum(WorkoutSet.weight * WorkoutSet.reps).label('volume'))
        .join(WorkoutSet, WorkoutSet.exercise_id == Exercise.id)
        .join(WorkoutSession, WorkoutSession.id == WorkoutSet.session_id)
        .filter(WorkoutSession.user_id == user.id, WorkoutSession.date >= seven_days_ago)
        .filter(WorkoutSet.weight.is_not(None), WorkoutSet.reps.is_not(None))
        .group_by(Exercise.muscle_group)
    )
    res_vol = await db.execute(query)
    volumes = res_vol.all()
    vol_str = ", ".join([f"{v[0].value if hasattr(v[0], 'value') else v[0]}: {v[1]}kg" for v in volumes]) or "Faible volume"
    
    sys_prompt = "Tu es ForgeFive Coach. En te basant sur les métriques de récupération et le volume de travail récent, donne une recommandation courte, précise et personnalisée en français pour la journée."
    user_msg = f"Sommeil: {latest_recov.sleep_hours}h (qualité: {latest_recov.sleep_quality}/5). Courbatures: {latest_recov.soreness_level}/5. Énergie: {latest_recov.energy_level}/5. Volume récent par groupe: {vol_str}"
    
    client = GeminiClient()
    return await client.generate_with_system_prompt(sys_prompt, user_msg)
