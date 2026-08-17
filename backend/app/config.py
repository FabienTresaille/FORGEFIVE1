import os
import json
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union
from pydantic import field_validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "ForgeFive"
    API_V1_STR: str = ""
    
    # SECURITY
    JWT_SECRET: str = "super_secret_jwt_key_for_development_change_in_production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    # DATABASE
    DATABASE_URL: str = "postgresql+asyncpg://forgefive:forgefive@db:5432/forgefive"
    
    # ADMIN BOOTSTRAP
    ADMIN_INITIAL_EMAIL: str = "admin@example.com"
    ADMIN_INITIAL_PASSWORD: str = "admin123"
    
    # EXTERNAL APIS
    GEMINI_API_KEY: str = ""
    
    # CORS
    CORS_ORIGINS: Union[List[str], str] = ["*"]
    
    DOMAIN: str = "perfs.alsek.fr"

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, str) and v.startswith("["):
            try:
                return json.loads(v)
            except Exception:
                return [v]
        elif isinstance(v, list):
            return v
        return ["*"]

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False, extra="ignore")

settings = Settings()
