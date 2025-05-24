from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from tortoise import Tortoise, run_async
from contextlib import asynccontextmanager
from app.routes import auth, coupons
from app.config import settings

# Initialize Tortoise ORM
async def init_db():
    db_config = settings.database_config
    print("Initializing database with config:", 
          {k: v if k != 'password' else '****' 
           for k, v in db_config['connections']['default']['credentials'].items()})
    
    try:
        await Tortoise.init(config=db_config)
        # Generate schemas
        await Tortoise.generate_schemas()
        print("Database connection successful")
    except Exception as e:
        print(f"Failed to initialize database: {str(e)}")
        raise

# Lifespan context manager for FastAPI
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB
    await init_db()
    yield  # App runs here
    # Shutdown: Close DB connections
    await Tortoise.close_connections()

app = FastAPI(title="DRS Coupon App API", description="API for DRS Coupon Management", lifespan=lifespan)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(coupons.router, prefix="/api/coupons", tags=["coupons"])

@app.get("/api/health", tags=["Health"])
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
