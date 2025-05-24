from fastapi import APIRouter, Depends, HTTPException, status, Request
from typing import List, Optional
from pydantic import BaseModel
import uuid
from datetime import datetime

from app.models import User, Coupon, Coupon_Pydantic, CouponCreate_Pydantic
from app.deps import get_current_user, get_optional_user
from app.utils.logger import logger

router = APIRouter()

class BarcodeData(BaseModel):
    barcode: str
    value: Optional[float] = None
    currency: Optional[str] = "EUR"

@router.post("/", response_model=Coupon_Pydantic)
async def create_coupon(
    barcode_data: BarcodeData,
    request: Request,
    current_user: User = Depends(get_current_user)
):
    """
    Save a new DRS coupon after scanning
    """
    coupon = await Coupon.create(
        id=uuid.uuid4(),
        barcode=barcode_data.barcode,
        value=barcode_data.value,
        currency=barcode_data.currency,
        user=current_user,
        scanned_at=datetime.utcnow()
    )
    return await Coupon_Pydantic.from_tortoise_orm(coupon)

@router.get("/", response_model=List[Coupon_Pydantic])
async def get_coupons(
    request: Request,
    used: bool = None,
    current_user: User = Depends(get_optional_user)
):
    """
    Get all coupons for the current user
    Optional filter by used/unused status
    """
    # If user is not authenticated, return empty list instead of 401
    if not current_user:
        logger.warning(f"Unauthenticated access to coupons from {request.client.host if request.client else 'unknown'}")
        # Return an empty list of Pydantic models directly
        return []
    
    # User is authenticated, proceed normally
    query = {"user_id": current_user.id}
    if used is not None:
        query["is_used"] = used
    
    logger.info(f"Fetching coupons for user {current_user.email}, used filter: {used}")
    coupons = await Coupon.filter(**query).order_by("-scanned_at")
    
    # Convert queryset to Pydantic models and return
    result = await Coupon_Pydantic.from_queryset(coupons)
    return result

@router.get("/{coupon_id}", response_model=Coupon_Pydantic)
async def get_coupon(
    coupon_id: uuid.UUID,
    request: Request,
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific coupon by ID
    """
    coupon = await Coupon.get_or_none(id=coupon_id, user_id=current_user.id)
    if not coupon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Coupon not found"
        )
    return await Coupon_Pydantic.from_tortoise_orm(coupon)

@router.put("/{coupon_id}/mark-used", response_model=Coupon_Pydantic)
async def mark_coupon_as_used(
    coupon_id: uuid.UUID,
    request: Request,
    current_user: User = Depends(get_current_user)
):
    """
    Mark a coupon as used after redeeming at a store
    """
    coupon = await Coupon.get_or_none(id=coupon_id, user_id=current_user.id)
    if not coupon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Coupon not found"
        )
    
    coupon.is_used = True
    coupon.used_at = datetime.utcnow()
    await coupon.save()
    
    return await Coupon_Pydantic.from_tortoise_orm(coupon)

@router.delete("/{coupon_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_coupon(
    coupon_id: uuid.UUID,
    request: Request,
    current_user: User = Depends(get_current_user)
):
    """
    Delete a coupon
    """
    coupon = await Coupon.get_or_none(id=coupon_id, user_id=current_user.id)
    if not coupon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Coupon not found"
        )
    
    await coupon.delete()
    return None
