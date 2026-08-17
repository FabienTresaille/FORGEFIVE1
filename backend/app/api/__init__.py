from fastapi import APIRouter
from app.api import auth, admin, exercises, routines, workouts, rankings, recovery, coach, gamification, activity_feed

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(exercises.router, prefix="/exercises", tags=["exercises"])
api_router.include_router(routines.router, prefix="/routines", tags=["routines"])
api_router.include_router(workouts.router, prefix="/workouts", tags=["workouts"])
api_router.include_router(rankings.router, prefix="/rankings", tags=["rankings"])
api_router.include_router(recovery.router, prefix="/recovery", tags=["recovery"])
api_router.include_router(coach.router, prefix="/coach", tags=["coach"])
api_router.include_router(gamification.router, prefix="/gamification", tags=["gamification"])
api_router.include_router(activity_feed.router, prefix="/feed", tags=["feed"])
