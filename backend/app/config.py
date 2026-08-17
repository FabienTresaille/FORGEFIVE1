import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union
from pydantic import AnyHttpUrl, validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "ForgeFive"
    API_V1_STR: str = ""
    
    # SECURITY
    JWT_SECRET: str = "super_secret_jwt_key_for_development_change_in_production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # DATABASE
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/forgefive"
    
    # ADMIN
    ADMIN_INITIAL_EMAIL: str = "admin@forgefive.com"
    ADMIN_INITIAL_PASSWORD: str = "admin123"
    
    # EXTERNAL APIS
    GEMINI_API_KEY: str = ""
    
    # CORS
    CORS_ORIGINS: List[str] = ["*"]
    
    DOMAIN: str = "perfs.alsek.fr"

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
