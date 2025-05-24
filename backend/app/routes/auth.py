from fastapi import APIRouter, Depends, HTTPException, status, Request
from app.deps import get_current_user, oauth2_scheme
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from pydantic import BaseModel
from passlib.hash import bcrypt
import random
import string
import uuid

from app.models import User, User_Pydantic
from app.config import settings
from app.utils.email import email_sender
from app.utils.logger import logger

router = APIRouter()

class SignupRequest(BaseModel):
    email: str
    password: str
    name: Optional[str] = None

class SigninRequest(BaseModel):
    email: str
    password: str

class OTPVerifyRequest(BaseModel):
    email: str
    otp: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def generate_otp(length=6, email=None):
    otp = ''.join(random.choices(string.digits, k=length))
    logger.info(f"OTP generated for user {email}: {otp}")
    return otp

@router.post("/signup", status_code=201)
async def signup(payload: SignupRequest):
    existing = await User.get_or_none(email=payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered.")
    password_hash = bcrypt.hash(payload.password)
    otp = generate_otp(email=payload.email)
    now = datetime.utcnow()
    user = await User.create(
        id=uuid.uuid4(),
        email=payload.email,
        name=payload.name,
        password_hash=password_hash,
        is_verified=False,
        otp=otp,
        otp_created_at=now
    )
    logger.info(f"New user created: {payload.email}")
    # Send OTP email
    subject = "Your DRS App Verification Code"
    body = f"Your verification code is: {otp}"
    try:
        email_sender.send_email(payload.email, subject, body)
        logger.info(f"OTP email sent to: {payload.email}")
    except Exception as e:
        logger.error(f"Failed to send email to {payload.email}: {str(e)}")
        await user.delete()
        raise HTTPException(status_code=500, detail=f"Failed to send verification email: {e}")
    return {"msg": "Signup successful. Please verify your email with the OTP sent."}

@router.post("/signin", response_model=Token)
async def signin(payload: SigninRequest, request: Request):
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"Login attempt from {client_ip} for email: {payload.email}")
    
    # Check for test user credentials
    if payload.email == "test@gmail.com" and payload.password == "1234":
        # Get or create test user
        test_user = await User.get_or_none(email="test@gmail.com")
        if not test_user:
            # Create test user if it doesn't exist
            test_user = await User.create(
                id=uuid.uuid4(),
                email="test@gmail.com",
                name="Test User",
                password_hash=bcrypt.hash("1234"),
                is_verified=True,
                created_at=datetime.utcnow()
            )
            logger.info("Test user created")
        
        test_user.last_login = datetime.utcnow()
        await test_user.save()
        logger.info(f"Test user logged in: {test_user.email}")
        
        # Create a long-lived token for test user
        access_token_expires = timedelta(days=30)  # Extend token validity for test user
        access_token = create_access_token(data={"sub": str(test_user.id)}, expires_delta=access_token_expires)
        user_dict = await User_Pydantic.from_tortoise_orm(test_user)
        return {"access_token": access_token, "token_type": "bearer", "user": user_dict.dict()}
    
    # Normal authentication flow
    user = await User.get_or_none(email=payload.email)
    if not user:
        logger.warning(f"Login attempt failed: User not found - {payload.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not user.password_hash or not bcrypt.verify(payload.password, user.password_hash):
        logger.warning(f"Login attempt failed: Invalid password for {payload.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is verified
    if not user.is_verified:
        logger.warning(f"Login attempt failed: Unverified user {payload.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email not verified. Please verify your email first.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user.last_login = datetime.utcnow()
    await user.save()
    logger.info(f"User logged in: {user.email}")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": str(user.id)}, expires_delta=access_token_expires)
    user_dict = await User_Pydantic.from_tortoise_orm(user)
    return {"access_token": access_token, "token_type": "bearer", "user": user_dict.dict()}

@router.post("/verify-otp")
async def verify_otp(payload: OTPVerifyRequest):
    user = await User.get_or_none(email=payload.email)
    if not user:
        logger.warning(f"OTP verification failed: User not found - {payload.email}")
        raise HTTPException(status_code=404, detail="User not found.")
    
    if user.is_verified:
        logger.info(f"OTP verification skipped: User already verified - {payload.email}")
        return {"msg": "Email already verified."}
    
    if not user.otp or not user.otp_created_at:
        logger.warning(f"OTP verification failed: No OTP found for user - {payload.email}")
        raise HTTPException(status_code=400, detail="No OTP found. Please sign up again.")
    
    # Check OTP expiry (10 min)
    if (datetime.utcnow() - user.otp_created_at).total_seconds() > 600:
        logger.warning(f"OTP verification failed: OTP expired for user - {payload.email}")
        raise HTTPException(status_code=400, detail="OTP expired. Please sign up again.")
    
    if user.otp != payload.otp:
        logger.warning(f"OTP verification failed: Invalid OTP for user - {payload.email}, provided: {payload.otp}, expected: {user.otp}")
        raise HTTPException(status_code=400, detail="Invalid OTP.")
    
    user.is_verified = True
    user.otp = None
    user.otp_created_at = None
    await user.save()
    logger.info(f"User email verified successfully: {payload.email}")
    return {"msg": "Email verified successfully. You may now sign in."}


class ResendOTPRequest(BaseModel):
    email: str

@router.post("/resend-otp")
async def resend_otp(payload: ResendOTPRequest):
    user = await User.get_or_none(email=payload.email)
    if not user:
        logger.warning(f"Resend OTP failed: User not found - {payload.email}")
        raise HTTPException(status_code=404, detail="User not found.")
    if user.is_verified:
        logger.info(f"Resend OTP skipped: User already verified - {payload.email}")
        return {"msg": "Email already verified."}
    otp = generate_otp(email=payload.email)
    user.otp = otp
    user.otp_created_at = datetime.utcnow()
    await user.save()
    logger.info(f"OTP regenerated for user: {payload.email}")
    subject = "Your DRS App Verification Code (Resend)"
    body = f"Your verification code is: {otp}"
    try:
        email_sender.send_email(user.email, subject, body)
        logger.info(f"Resent OTP email to: {payload.email}")
    except Exception as e:
        logger.error(f"Failed to send resend OTP email to {payload.email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send verification email: {e}")
    return {"msg": "OTP resent successfully. Please check your email."}


class PasswordResetRequest(BaseModel):
    email: str

class PasswordResetVerifyRequest(BaseModel):
    email: str
    otp: str
    new_password: str

@router.post("/request-password-reset")
async def request_password_reset(payload: PasswordResetRequest):
    user = await User.get_or_none(email=payload.email)
    if not user:
        logger.warning(f"Password reset failed: User not found - {payload.email}")
        raise HTTPException(status_code=404, detail="User not found.")
    otp = generate_otp(email=payload.email)
    user.otp = otp
    user.otp_created_at = datetime.utcnow()
    await user.save()
    logger.info(f"Password reset OTP generated for user: {payload.email}")
    subject = "Your DRS App Password Reset Code"
    body = f"Your password reset code is: {otp}"
    try:
        email_sender.send_email(user.email, subject, body)
        logger.info(f"Password reset OTP email sent to: {payload.email}")
    except Exception as e:
        logger.error(f"Failed to send password reset email to {payload.email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send password reset email: {e}")
    return {"msg": "Password reset OTP sent. Please check your email."}

@router.post("/reset-password")
async def reset_password(payload: PasswordResetVerifyRequest):
    user = await User.get_or_none(email=payload.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    if not user.otp or not user.otp_created_at:
        raise HTTPException(status_code=400, detail="No OTP found. Please request password reset again.")
    # Check OTP expiry (10 min)
    if (datetime.utcnow() - user.otp_created_at).total_seconds() > 600:
        raise HTTPException(status_code=400, detail="OTP expired. Please request password reset again.")
    if user.otp != payload.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP.")
    user.password_hash = bcrypt.hash(payload.new_password)
    user.otp = None
    user.otp_created_at = None
    await user.save()
    return {"msg": "Password reset successful. You may now sign in."}

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict



def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

@router.get("/me", response_model=User_Pydantic)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return await User_Pydantic.from_tortoise_orm(current_user)
