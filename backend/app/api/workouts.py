from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import func
from typing import List, Any, Optional
from datetime import datetime
import uuid

from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.workout import WorkoutSession, WorkoutSet
from app.models.exercise import Exercise, MuscleGroup
from app.schemas.workout import WorkoutSessionResponse, WorkoutSessionCreate, WorkoutSessionUpdate, WorkoutSetCreate, WorkoutSetResponse

router = APIRouter()

async def _resolve_exercise_id(db: AsyncSession, exercise_id: Optional[uuid.UUID], exercise_name: Optional[str], user_id: uuid.UUID) -> uuid.UUID:
    if exercise_id:
        res = await db.execute(select(Exercise).filter(Exercise.id == exercise_id))
        ex = res.scalars().first()
        if ex:
            return ex.id

    if exercise_name and exercise_name.strip():
        clean_name = exercise_name.strip()
        res = await db.execute(select(Exercise).filter(func.lower(Exercise.name) == clean_name.lower()))
        ex = res.scalars().first()
        if ex:
            return ex.id

        # Auto-create custom exercise if not found
        new_ex = Exercise(
            name=clean_name,
            muscle_group=MuscleGroup.full_body,
            is_custom=True,
            created_by_user_id=user_id
        )
        db.add(new_ex)
        await db.flush()
        return new_ex.id

    # Fallback to any first exercise in DB
    res = await db.execute(select(Exercise).limit(1))
    ex = res.scalars().first()
    if ex:
        return ex.id

    # If DB has no exercises, create a default base exercise
    default_ex = Exercise(
        name="Exercice général",
        muscle_group=MuscleGroup.full_body,
        is_custom=False
    )
    db.add(default_ex)
    await db.flush()
    return default_ex.id

@router.post("", response_model=WorkoutSessionResponse)
async def create_workout(
    data: WorkoutSessionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    notes_val = data.notes or data.title
    new_sess = WorkoutSession(
        user_id=current_user.id,
        date=data.date or datetime.utcnow(),
        duration_minutes=data.duration_minutes,
        notes=notes_val,
        rpe_global=data.rpe_global,
        started_at=data.started_at or datetime.utcnow(),
        completed_at=data.completed_at
    )
    db.add(new_sess)
    await db.flush()
    
    if data.sets:
        for s in data.sets:
            ex_id = await _resolve_exercise_id(db, s.exercise_id, s.exercise_name, current_user.id)
            set_dict = s.model_dump(exclude={"exercise_name"})
            set_dict["exercise_id"] = ex_id
            db.add(WorkoutSet(session_id=new_sess.id, **set_dict))
            
    await db.commit()
    result = await db.execute(
        select(WorkoutSession).options(selectinload(WorkoutSession.sets)).filter(WorkoutSession.id == new_sess.id)
    )
    return result.scalars().first()

@router.get("", response_model=List[WorkoutSessionResponse])
async def list_workouts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(
        select(WorkoutSession)
        .options(selectinload(WorkoutSession.sets))
        .filter(WorkoutSession.user_id == current_user.id)
        .order_by(WorkoutSession.date.desc())
    )
    return result.scalars().all()

@router.get("/{session_id}", response_model=WorkoutSessionResponse)
async def get_workout(
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(
        select(WorkoutSession).options(selectinload(WorkoutSession.sets)).filter(WorkoutSession.id == session_id, WorkoutSession.user_id == current_user.id)
    )
    sess = result.scalars().first()
    if not sess:
        raise HTTPException(status_code=404, detail="Workout session not found")
    return sess

@router.patch("/{session_id}", response_model=WorkoutSessionResponse)
async def update_workout(
    session_id: uuid.UUID,
    data: WorkoutSessionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(
        select(WorkoutSession).options(selectinload(WorkoutSession.sets)).filter(WorkoutSession.id == session_id, WorkoutSession.user_id == current_user.id)
    )
    sess = result.scalars().first()
    if not sess:
        raise HTTPException(status_code=404, detail="Workout session not found")
        
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(sess, key, val)
        
    await db.commit()
    return sess

@router.post("/{session_id}/sets", response_model=List[WorkoutSetResponse])
async def add_workout_sets(
    session_id: uuid.UUID,
    sets: List[WorkoutSetCreate],
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(select(WorkoutSession).filter(WorkoutSession.id == session_id, WorkoutSession.user_id == current_user.id))
    if not result.scalars().first():
        raise HTTPException(status_code=404, detail="Workout session not found")
        
    new_sets = []
    for s in sets:
        ex_id = await _resolve_exercise_id(db, s.exercise_id, s.exercise_name, current_user.id)
        set_dict = s.model_dump(exclude={"exercise_name"})
        set_dict["exercise_id"] = ex_id
        new_set = WorkoutSet(session_id=session_id, **set_dict)
        db.add(new_set)
        new_sets.append(new_set)
        
    await db.commit()
    for s in new_sets:
        await db.refresh(s)
    return new_sets

@router.get("/exercise/{exercise_id}/history", response_model=List[WorkoutSetResponse])
async def get_exercise_history(
    exercise_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(
        select(WorkoutSet)
        .join(WorkoutSession)
        .filter(WorkoutSession.user_id == current_user.id, WorkoutSet.exercise_id == exercise_id)
        .order_by(WorkoutSession.date.desc())
    )
    return result.scalars().all()
