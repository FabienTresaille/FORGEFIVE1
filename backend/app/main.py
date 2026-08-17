from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.future import select
from contextlib import asynccontextmanager

from app.config import settings
from app.api import api_router
from app.database import AsyncSessionLocal
from app.models.user import User
from app.services.auth_service import get_password_hash
import json
import os
from app.models.exercise import Exercise

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Bootstrap admin
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
            
        # Seed exercises if none
        ex_res = await session.execute(select(Exercise).limit(1))
        if not ex_res.scalars().first():
            seed_path = os.path.join(os.path.dirname(__file__), "seed", "exercises.json")
            if os.path.exists(seed_path):
                with open(seed_path, "r", encoding="utf-8") as f:
                    exercises = json.load(f)
                    for ex in exercises:
                        session.add(Exercise(**ex, is_custom=False))
                await session.commit()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Welcome to ForgeFive API"}
