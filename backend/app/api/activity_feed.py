from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import func
from typing import List, Any
import uuid

from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.activity_feed import ActivityPost, ActivityLike, ActivityComment
from app.schemas.activity_feed import ActivityPostResponse, ActivityCommentCreate, ActivityCommentResponse
from app.services import feed_service

router = APIRouter()

@router.get("", response_model=List[ActivityPostResponse])
async def get_feed(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(
        select(ActivityPost)
        .order_by(ActivityPost.published_at.desc())
        .limit(20)
    )
    posts = result.scalars().all()
    for post in posts:
        res_likes = await db.execute(select(func.count(ActivityLike.id)).filter(ActivityLike.post_id == post.id))
        post.likes_count = res_likes.scalar()
        
    return posts

@router.get("/{post_id}", response_model=ActivityPostResponse)
async def get_post(
    post_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(select(ActivityPost).filter(ActivityPost.id == post_id))
    post = result.scalars().first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    res_likes = await db.execute(select(func.count(ActivityLike.id)).filter(ActivityLike.post_id == post.id))
    post.likes_count = res_likes.scalar()
    return post

@router.post("/publish/{session_id}", response_model=ActivityPostResponse)
async def publish_workout(
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    summary = await feed_service.generate_activity_summary(db, session_id)
    bodygraph_data = await feed_service.generate_bodygraph_data(db, session_id)
    
    post = ActivityPost(
        user_id=current_user.id,
        workout_session_id=session_id,
        summary=summary,
        bodygraph_data=bodygraph_data
    )
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return post

@router.post("/{post_id}/like")
async def like_post(
    post_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(select(ActivityLike).filter(ActivityLike.post_id == post_id, ActivityLike.user_id == current_user.id))
    like = result.scalars().first()
    if like:
        await db.delete(like)
        await db.commit()
        return {"msg": "Unliked"}
    else:
        new_like = ActivityLike(post_id=post_id, user_id=current_user.id)
        db.add(new_like)
        try:
            await db.commit()
        except Exception:
            await db.rollback()
        return {"msg": "Liked"}

@router.post("/{post_id}/comments", response_model=ActivityCommentResponse)
async def add_comment(
    post_id: uuid.UUID,
    data: ActivityCommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    comment = ActivityComment(post_id=post_id, user_id=current_user.id, content=data.content)
    db.add(comment)
    await db.commit()
    await db.refresh(comment)
    return comment

@router.delete("/{post_id}/comments/{comment_id}")
async def delete_comment(
    post_id: uuid.UUID,
    comment_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(select(ActivityComment).filter(ActivityComment.id == comment_id, ActivityComment.user_id == current_user.id))
    comment = result.scalars().first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    await db.delete(comment)
    await db.commit()
    return {"msg": "Comment deleted"}
