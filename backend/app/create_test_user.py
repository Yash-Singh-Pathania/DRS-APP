import asyncio
import uuid
from datetime import datetime
from app.models import User
from passlib.hash import bcrypt
from tortoise import Tortoise, run_async

async def run():
    await Tortoise.init(
        db_url="postgres://postgres:postgres@localhost:5432/drs_app",  # or use your DATABASE_URL
        modules={"models": ["app.models"]},
    )
    await Tortoise.generate_schemas()
    user, created = await User.get_or_create(
        email="test@gmail.com",
        defaults={
            "id": uuid.uuid4(),
            "name": "Test User",
            "password_hash": bcrypt.hash("test"),
            "is_verified": True,
            "otp": None,
            "otp_created_at": None,
            "last_login": datetime.utcnow(),
        }
    )
    if created:
        print("Test user created.")
    else:
        print("Test user already exists.")
    await Tortoise.close_connections()

if __name__ == "__main__":
    run_async(run())