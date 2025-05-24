import os
from pydantic import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database settings - Connection URL approach
    _DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL", None)
    
    # Database settings - Individual credentials approach
    DB_USERNAME: str = os.getenv("DB_USERNAME", "postgres")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "postgres")
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: str = os.getenv("DB_PORT", "5432")
    DB_DATABASE: str = os.getenv("DB_DATABASE", "drs_app")
    DB_SSL: bool = os.getenv("DB_SSL", "false").lower() == "true"
    
    @property
    def DATABASE_URL(self) -> str:
        # Build the connection URL from individual credentials
        db_url = f"postgres://{self.DB_USERNAME}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_DATABASE}"
        print(f"Using database URL: postgres://{self.DB_USERNAME}:****@{self.DB_HOST}:{self.DB_PORT}/{self.DB_DATABASE}")
        return db_url
    
    @property
    def database_config(self) -> dict:
        """Return database configuration with SSL settings for asyncpg."""
        config = {
            "connections": {
                "default": {
                    "engine": "tortoise.backends.asyncpg",
                    "credentials": {
                        "host": self.DB_HOST,
                        "port": self.DB_PORT,
                        "user": self.DB_USERNAME,
                        "password": self.DB_PASSWORD,
                        "database": self.DB_DATABASE,
                        "ssl": "require" if self.DB_SSL else None
                    }
                }
            },
            "apps": {
                "models": {
                    "models": ["app.models", "aerich.models"],
                    "default_connection": "default",
                }
            }
        }
        return config
    
    # JWT settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-for-jwt-please-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # SMTP email settings
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.example.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", 587))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", "noreply@example.com")
    SMTP_USE_TLS: bool = bool(int(os.getenv("SMTP_USE_TLS", 1)))
    
    # CORS settings
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173"]
    
    class Config:
        env_file = ".env"

settings = Settings()

# Aerich/Tortoise ORM config for migrations
TORTOISE_ORM = {
    "connections": {"default": settings.DATABASE_URL},
    "apps": {
        "models": {
            "models": ["app.models", "aerich.models"],
            "default_connection": "default",
        },
    },
}
