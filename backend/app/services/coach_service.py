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
from app.models.exercise import Exercise, MuscleGroup
from app.services.gemini_client import GeminiClient
import json

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

async def generate_daily_workout(db: AsyncSession, user: User):
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    res_workouts = await db.execute(
        select(WorkoutSession)
        .options(selectinload(WorkoutSession.sets))
        .filter(WorkoutSession.user_id == user.id, WorkoutSession.date >= seven_days_ago)
    )
    workouts = res_workouts.scalars().all()
    
    exercise_ids = set()
    for w in workouts:
        for s in w.sets:
            if getattr(s, 'exercise_id', None):
                exercise_ids.add(s.exercise_id)
                
    exercises = {}
    if exercise_ids:
        res_ex = await db.execute(select(Exercise).filter(Exercise.id.in_(exercise_ids)))
        for ex in res_ex.scalars().all():
            exercises[ex.id] = ex
            
    muscle_last_worked = {}
    for w in workouts:
        for s in w.sets:
            if getattr(s, 'exercise_id', None) in exercises:
                ex = exercises[s.exercise_id]
                m = ex.muscle_group.value
                if m not in muscle_last_worked or w.date > muscle_last_worked[m]:
                    muscle_last_worked[m] = w.date
                    
    now = datetime.utcnow()
    muscle_recovery_map = {}
    for m in MuscleGroup:
        m_val = m.value
        if m_val in muscle_last_worked:
            hours_ago = (now - muscle_last_worked[m_val]).total_seconds() / 3600
            if hours_ago < 48:
                muscle_recovery_map[m_val] = "en récupération"
            else:
                muscle_recovery_map[m_val] = "frais"
        else:
            muscle_recovery_map[m_val] = "frais"

    res_recov = await db.execute(
        select(RecoveryEntry)
        .filter(RecoveryEntry.user_id == user.id)
        .order_by(desc(RecoveryEntry.date))
        .limit(1)
    )
    recovery = res_recov.scalars().first()
    recovery_info = f"Sommeil: {recovery.sleep_hours}h, Energie: {recovery.energy_level}/5, Douleurs: {recovery.soreness_level}/5" if recovery else "Aucune donnée de récupération"

    sys_prompt = f"""Tu es ForgeFive Coach.
L'utilisateur a besoin d'un plan d'entraînement quotidien généré par l'IA.
Réponds STRICTEMENT au format JSON.

Profil utilisateur:
- Objectif: {getattr(user, 'goal', 'Non spécifié')}
- Poids: {getattr(user, 'weight_kg', 'Non spécifié')} kg
- Taille: {getattr(user, 'height_cm', 'Non spécifié')} cm
- Fréquence hebdo: {getattr(user, 'weekly_frequency', 'Non spécifiée')} séances
- Durée souhaitée: {getattr(user, 'session_duration_minutes', 'Non spécifiée')} minutes

Etat de récupération musculaire:
{json.dumps(muscle_recovery_map, ensure_ascii=False, indent=2)}

Saisie de récupération du jour:
{recovery_info}

Consignes:
- Propose une séance adaptée à l'objectif, à la durée souhaitée et à la récupération (évite les muscles "en récupération").
- Le JSON doit avoir EXACTEMENT la structure suivante :
{{
  "title": "Titre de la séance",
  "focus_muscles": ["muscle1", "muscle2"],
  "recovery_note": "Explication courte sur le choix des muscles par rapport à la récupération",
  "exercises": [
    {{
      "name": "Nom de l'exercice",
      "sets": 3,
      "reps": "8-12",
      "rest_seconds": 90,
      "notes": "Conseil d'exécution"
    }}
  ]
}}
- TOUTES les clés doivent être en anglais comme défini ci-dessus, les valeurs en français.
"""
    client = GeminiClient()
    response_text = await client.generate_with_system_prompt(sys_prompt, "Génère mon entraînement du jour au format JSON.")
    
    try:
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}') + 1
        json_str = response_text[start_idx:end_idx]
        return json.loads(json_str)
    except Exception as e:
        return {"error": "Failed to parse AI response", "raw_response": response_text}

