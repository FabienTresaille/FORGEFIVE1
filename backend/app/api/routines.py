from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Any
import uuid

from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.routine import Routine, RoutineExercise
from app.schemas.routine import RoutineResponse, RoutineCreate, RoutineUpdate

router = APIRouter()

@router.get("", response_model=List[RoutineResponse])
async def list_routines(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(
        select(Routine).options(selectinload(Routine.exercises)).filter(Routine.user_id == current_user.id)
    )
    return result.scalars().all()

@router.post("", response_model=RoutineResponse)
async def create_routine(
    data: RoutineCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    new_routine = Routine(
        user_id=current_user.id,
        name=data.name,
        description=data.description
    )
    db.add(new_routine)
    await db.flush()
    
    for ex in data.exercises:
        r_ex = RoutineExercise(
            routine_id=new_routine.id,
            **ex.model_dump()
        )
        db.add(r_ex)
        
    await db.commit()
    result = await db.execute(
        select(Routine).options(selectinload(Routine.exercises)).filter(Routine.id == new_routine.id)
    )
    return result.scalars().first()

@router.get("/{routine_id}", response_model=RoutineResponse)
async def get_routine(
    routine_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(
        select(Routine).options(selectinload(Routine.exercises)).filter(Routine.id == routine_id, Routine.user_id == current_user.id)
    )
    routine = result.scalars().first()
    if not routine:
        raise HTTPException(status_code=404, detail="Routine not found")
    return routine

@router.put("/{routine_id}", response_model=RoutineResponse)
async def update_routine(
    routine_id: uuid.UUID,
    data: RoutineUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(
        select(Routine).options(selectinload(Routine.exercises)).filter(Routine.id == routine_id, Routine.user_id == current_user.id)
    )
    routine = result.scalars().first()
    if not routine:
        raise HTTPException(status_code=404, detail="Routine not found")
        
    if data.name is not None:
        routine.name = data.name
    if data.description is not None:
        routine.description = data.description
        
    if data.exercises is not None:
        await db.execute(RoutineExercise.__table__.delete().where(RoutineExercise.routine_id == routine_id))
        for ex in data.exercises:
            db.add(RoutineExercise(routine_id=routine_id, **ex.model_dump()))
            
    await db.commit()
    result = await db.execute(
        select(Routine).options(selectinload(Routine.exercises)).filter(Routine.id == routine_id)
    )
    return result.scalars().first()

@router.delete("/{routine_id}")
async def delete_routine(
    routine_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(select(Routine).filter(Routine.id == routine_id, Routine.user_id == current_user.id))
    routine = result.scalars().first()
    if not routine:
        raise HTTPException(status_code=404, detail="Routine not found")
    await db.delete(routine)
    await db.commit()
    return {"msg": "Routine deleted"}

@router.post("/{routine_id}/duplicate", response_model=RoutineResponse)
async def duplicate_routine(
    routine_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(
        select(Routine).options(selectinload(Routine.exercises)).filter(Routine.id == routine_id, Routine.user_id == current_user.id)
    )
    routine = result.scalars().first()
    if not routine:
        raise HTTPException(status_code=404, detail="Routine not found")
        
    new_routine = Routine(
        user_id=current_user.id,
        name=f"{routine.name} (Copy)",
        description=routine.description
    )
    db.add(new_routine)
    await db.flush()
    
    for ex in routine.exercises:
        db.add(RoutineExercise(
            routine_id=new_routine.id,
            exercise_id=ex.exercise_id,
            order=ex.order,
            target_sets=ex.target_sets,
            target_reps=ex.target_reps,
            target_weight=ex.target_weight
        ))
        
    await db.commit()
    result = await db.execute(
        select(Routine).options(selectinload(Routine.exercises)).filter(Routine.id == new_routine.id)
    )
    return result.scalars().first()
