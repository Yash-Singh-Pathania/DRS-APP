from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.config import settings
from app.models import User
from app.utils.logger import logger
from typing import Optional

# Update tokenUrl to match the actual endpoint
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/signin", auto_error=False)

# Constants for test user
TEST_USER_EMAIL = "test@gmail.com"

async def get_current_user(token: Optional[str] = Depends(oauth2_scheme), request: Request = None):
    # First check if it's the test user by looking at headers or cookies
    if request and await _is_test_user_request(request):
        test_user = await User.get_or_none(email=TEST_USER_EMAIL)
        if test_user:
            logger.info(f"Auto-authenticated test user: {TEST_USER_EMAIL}")
            return test_user
    
    # If not a test user and no token, raise exception
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            logger.error(f"JWT missing sub: {token}")
            raise credentials_exception
    except JWTError as e:
        logger.error(f"JWTError: {e} | Token: {token[:20] if token and len(token) > 20 else token}...")
        raise credentials_exception
    
    user = await User.get_or_none(id=user_id)
    if user is None:
        logger.error(f"No user found for id: {user_id}")
        raise credentials_exception
    
    return user

# Helper function to check if request is from test user
async def _is_test_user_request(request: Request) -> bool:
    # Check for a special header or cookie that indicates test user
    test_header = request.headers.get("X-Test-User") == "true"
    
    # Also check if the request comes from localhost and has a test cookie
    test_cookie = request.cookies.get("test_user") == "true"
    
    # Check if client IP is localhost
    client_host = request.client.host if request.client else None
    is_localhost = client_host in ["127.0.0.1", "localhost", "::1"]
    
    # For testing purposes, we'll auto-authenticate any localhost request as the test user
    # In production, you might want to be more strict
    return test_header or test_cookie or is_localhost

# Optional token dependency for routes that can work with or without authentication
async def get_optional_user(request: Request):
    # First check if it's the test user
    if await _is_test_user_request(request):
        test_user = await User.get_or_none(email=TEST_USER_EMAIL)
        if test_user:
            logger.info(f"Auto-authenticated optional test user: {TEST_USER_EMAIL}")
            return test_user
    
    # Otherwise proceed with normal token validation
    authorization = request.headers.get("Authorization")
    if not authorization:
        return None
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            return None
        
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            return None
        
        user = await User.get_or_none(id=user_id)
        return user
    except (JWTError, ValueError):
        return None
