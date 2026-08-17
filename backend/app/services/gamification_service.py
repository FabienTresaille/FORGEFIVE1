from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, desc
from datetime import datetime, date, timedelta
import uuid

from app.models.gamification import StreakCounter, Achievement, UserAchievement
from app.models.workout import WorkoutSession
from app.models.user import User

async def update_streak(db: AsyncSession, user: User):
    res = await db.execute(select(StreakCounter).filter(StreakCounter.user_id == user.id))
    counter = res.scalars().first()
    today = date.today()
    if not counter:
        counter = StreakCounter(user_id=user.id, current_streak=1, best_streak=1, last_workout_date=today)
        db.add(counter)
    else:
        if counter.last_workout_date:
            days_diff = (today - counter.last_workout_date).days
            if days_diff == 1:
                counter.current_streak += 1
            elif days_diff > 1:
                counter.current_streak = 1
        else:
            counter.current_streak = 1
            
        if counter.current_streak > counter.best_streak:
            counter.best_streak = counter.current_streak
            
        counter.last_workout_date = today
    await db.commit()

async def check_achievements(db: AsyncSession, user: User, session: WorkoutSession):
    res = await db.execute(select(WorkoutSession).filter(WorkoutSession.user_id == user.id))
    count = len(res.scalars().all())
    
    if count == 1:
        achv_res = await db.execute(select(Achievement).filter(Achievement.code == 'first_workout'))
        achv = achv_res.scalars().first()
        if not achv:
            achv = Achievement(code='first_workout', name='First Workout', description='Completed your first workout!')
            db.add(achv)
            await db.flush()
            
        u_achv_res = await db.execute(select(UserAchievement).filter(UserAchievement.user_id == user.id, UserAchievement.achievement_id == achv.id))
        if not u_achv_res.scalars().first():
            ua = UserAchievement(user_id=user.id, achievement_id=achv.id)
            db.add(ua)
            await db.commit()

async def get_attendance_ranking(db: AsyncSession):
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    query = (
        select(User.display_name, func.count(WorkoutSession.id).label('session_count'))
        .join(WorkoutSession, WorkoutSession.user_id == User.id)
        .filter(WorkoutSession.date >= thirty_days_ago)
        .group_by(User.display_name)
        .order_by(desc('session_count'))
    )
    res = await db.execute(query)
    return [{"display_name": r[0], "session_count": r[1]} for r in res.all()]
