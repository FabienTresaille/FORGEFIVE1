from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Any
from sqlalchemy import or_
import uuid

from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.exercise import Exercise
from app.schemas.exercise import ExerciseResponse, ExerciseCreate, ExerciseUpdate

router = APIRouter()

@router.get("", response_model=List[ExerciseResponse])
async def list_exercises(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    # return custom exercises for this user and all global exercises
    result = await db.execute(
        select(Exercise).filter(
            or_(
                Exercise.is_custom == False,
                Exercise.created_by_user_id == current_user.id
            )
        )
    )
    return result.scalars().all()

@router.post("", response_model=ExerciseResponse)
async def create_exercise(
    data: ExerciseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    new_ex = Exercise(
        **data.model_dump(exclude={"is_custom"}),
        is_custom=True,
        created_by_user_id=current_user.id
    )
    db.add(new_ex)
    await db.commit()
    await db.refresh(new_ex)
    return new_ex

@router.get("/{exercise_id}", response_model=ExerciseResponse)
async def get_exercise(
    exercise_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(select(Exercise).filter(Exercise.id == exercise_id))
    ex = result.scalars().first()
    if not ex or (ex.is_custom and ex.created_by_user_id != current_user.id):
        raise HTTPException(status_code=404, detail="Exercise not found")
    return ex

@router.patch("/{exercise_id}", response_model=ExerciseResponse)
async def update_exercise(
    exercise_id: uuid.UUID,
    data: ExerciseUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(select(Exercise).filter(Exercise.id == exercise_id))
    ex = result.scalars().first()
    if not ex or (ex.is_custom and ex.created_by_user_id != current_user.id):
        raise HTTPException(status_code=404, detail="Exercise not found")
    if not ex.is_custom and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Cannot edit global exercise")
        
    update_data = data.model_dump(exclude_unset=True)
    for key, val in update_data.items():
        setattr(ex, key, val)
        
    await db.commit()
    await db.refresh(ex)
    return ex

@router.delete("/{exercise_id}")
async def delete_exercise(
    exercise_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(select(Exercise).filter(Exercise.id == exercise_id))
    ex = result.scalars().first()
    if not ex or (ex.is_custom and ex.created_by_user_id != current_user.id):
        raise HTTPException(status_code=404, detail="Exercise not found")
    if not ex.is_custom and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Cannot delete global exercise")
        
    await db.delete(ex)
    await db.commit()
    return {"msg": "Exercise deleted"}
