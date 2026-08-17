from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.future import select
from contextlib import asynccontextmanager
import json
import os

from app.config import settings
from app.api import api_router
from app.database import AsyncSessionLocal, engine, Base
from app.models import (
    User, Exercise, Routine, RoutineExercise,
    WorkoutSession, WorkoutSet, ExerciseRank,
    RecoveryEntry, CoachConversation, CoachMessage,
    StreakCounter, Achievement, UserAchievement,
    ActivityPost, ActivityLike, ActivityComment
)
from app.services.auth_service import get_password_hash

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Automatically create all tables on startup if they don't exist yet
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("Database schema verified / created successfully.")
    except Exception as e:
        print(f"Schema creation notice: {e}")

    # 2. Bootstrap initial admin account if not present
    try:
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(User).filter(User.email == settings.ADMIN_INITIAL_EMAIL))
            admin = result.scalars().first()
            if not admin:
                admin = User(
                    email=settings.ADMIN_INITIAL_EMAIL,
                    password_hash=get_password_hash(settings.ADMIN_INITIAL_PASSWORD),
                    display_name="Admin",
                    role="admin",
                    must_change_password=True
                )
                session.add(admin)
                await session.commit()
                print(f"Admin account created for {settings.ADMIN_INITIAL_EMAIL}")
                
            # 3. Seed exercises if database is empty
            ex_res = await session.execute(select(Exercise).limit(1))
            if not ex_res.scalars().first():
                seed_path = os.path.join(os.path.dirname(__file__), "seed", "exercises.json")
                if os.path.exists(seed_path):
                    with open(seed_path, "r", encoding="utf-8") as f:
                        exercises = json.load(f)
                        for ex in exercises:
                            session.add(Exercise(**ex, is_custom=False))
                    await session.commit()
                    print(f"Seeded {len(exercises)} base exercises into database.")
    except Exception as e:
        print(f"Error during startup bootstrap: {e}")
        
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json" if settings.API_V1_STR else "/openapi.json",
    docs_url="/docs",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Welcome to ForgeFive API", "status": "online"}
