from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import desc
from datetime import datetime, timedelta
import uuid

from app.models.user import User
from app.models.workout import WorkoutSession, WorkoutSet, ExerciseRank
from app.models.recovery import RecoveryEntry
from app.models.coach import CoachConversation, CoachMessage
from app.services.gemini_client import GeminiClient

def build_coach_system_prompt(user: User, recent_workouts, recent_recovery, ranks):
    display_name = getattr(user, 'display_name', 'User')
    goal = getattr(user, 'goal', 'Remise en forme et progression')
    recovery_info = f"{recent_recovery.sleep_hours}h sommeil, énergie {recent_recovery.energy_level}/5" if recent_recovery else "Aucune saisie récente"
    ranks_info = ', '.join([f'{r.exercise_id} ({r.rank_tier})' for r in ranks]) if ranks else 'Non classé'
    
    return f"""Tu es ForgeFive Coach, un coach sportif et préparateur physique personnalisé d'élite pour l'application ForgeFive.
Règles strictes :
- Ne donne JAMAIS de diagnostic médical. Si l'utilisateur mentionne une douleur aiguë, blessure ou malaise, conseille-lui fermement de consulter un professionnel de santé.
- Sois motivant, direct, technique et concis.
- Réponds toujours en français.

Profil utilisateur :
- Nom : {display_name}
- Objectif : {goal}
- Entraînements récents : {len(recent_workouts)} séances sur les 14 derniers jours.
- État de récupération du jour : {recovery_info}
- Rangs actuels : {ranks_info}
"""

async def get_coach_response(db: AsyncSession, user: User, message: str, conversation_id: uuid.UUID = None):
    fourteen_days_ago = datetime.utcnow() - timedelta(days=14)
    res_workouts = await db.execute(
        select(WorkoutSession)
        .options(selectinload(WorkoutSession.sets))
        .filter(WorkoutSession.user_id == user.id, WorkoutSession.date >= fourteen_days_ago)
        .order_by(desc(WorkoutSession.date))
    )
    workouts = res_workouts.scalars().all()
    
    res_recov = await db.execute(
        select(RecoveryEntry)
        .filter(RecoveryEntry.user_id == user.id)
        .order_by(desc(RecoveryEntry.date))
        .limit(1)
    )
    recovery = res_recov.scalars().first()
    
    res_ranks = await db.execute(
        select(ExerciseRank)
        .filter(ExerciseRank.user_id == user.id)
    )
    ranks = res_ranks.scalars().all()

    sys_prompt = build_coach_system_prompt(user, workouts, recovery, ranks)
    
    client = GeminiClient()
    
    if not conversation_id:
        conv = CoachConversation(user_id=user.id, title=message[:50])
        db.add(conv)
        await db.flush()
        conversation_id = conv.id
    
    user_msg = CoachMessage(conversation_id=conversation_id, role="user", content=message)
    db.add(user_msg)
    await db.flush()
    
    res_msgs = await db.execute(
        select(CoachMessage)
        .filter(CoachMessage.conversation_id == conversation_id)
        .order_by(CoachMessage.created_at)
    )
    history = res_msgs.scalars().all()
    
    context = ""
    for msg in history[-10:]:
        context += f"{msg.role}: {msg.content}\n"
    
    full_prompt = f"{context}\nassistant:"
    ai_response_text = await client.generate_with_system_prompt(sys_prompt, full_prompt)
    
    ai_msg = CoachMessage(conversation_id=conversation_id, role="assistant", content=ai_response_text)
    db.add(ai_msg)
    await db.commit()
    await db.refresh(ai_msg)
    
    return ai_msg

async def analyze_workout_session(db: AsyncSession, user: User, session_id: uuid.UUID):
    res = await db.execute(
        select(WorkoutSession)
        .options(selectinload(WorkoutSession.sets))
        .filter(WorkoutSession.id == session_id, WorkoutSession.user_id == user.id)
    )
    session = res.scalars().first()
    if not session:
        return {"analysis": "Séance introuvable."}
        
    sets_info = "\n".join([f"Série {s.set_number}: {s.weight}kg x {s.reps} reps (RPE {s.rpe})" for s in session.sets])
    sys_prompt = "Tu es ForgeFive Coach. Analyse cette séance de musculation/sport, donne un feedback constructif et 2 axes d'amélioration en 3-4 phrases en français. Pas de diagnostic médical."
    user_msg = f"Détails séance: Durée {session.duration_minutes}m. Notes: {session.notes or 'Aucune'}. Séries:\n{sets_info}"
    
    client = GeminiClient()
    analysis = await client.generate_with_system_prompt(sys_prompt, user_msg)
    return {"analysis": analysis}

async def get_daily_tip(db: AsyncSession, user: User):
    res_recov = await db.execute(
        select(RecoveryEntry)
        .filter(RecoveryEntry.user_id == user.id)
        .order_by(desc(RecoveryEntry.date))
        .limit(1)
    )
    recov = res_recov.scalars().first()
    
    res_work = await db.execute(
        select(WorkoutSession)
        .filter(WorkoutSession.user_id == user.id)
        .order_by(desc(WorkoutSession.date))
        .limit(1)
    )
    work = res_work.scalars().first()
    
    sys_prompt = "Tu es ForgeFive Coach. Donne un seul conseil du jour percutant, court (2 phrases max) et personnalisé en français pour la forme et la séance du jour."
    user_msg = f"Sommeil récent: {recov.sleep_hours if recov else 'Inconnu'}h. Dernière séance: {work.duration_minutes if work else 'Inconnue'}m."
    
    client = GeminiClient()
    tip = await client.generate_with_system_prompt(sys_prompt, user_msg)
    return {"tip": tip}
