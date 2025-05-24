from tortoise import fields, models
from tortoise.contrib.pydantic import pydantic_model_creator
from datetime import datetime

class User(models.Model):
    id = fields.UUIDField(pk=True)
    email = fields.CharField(max_length=255, unique=True)
    name = fields.CharField(max_length=255, null=True)
    password_hash = fields.CharField(max_length=255, null=True)
    is_verified = fields.BooleanField(default=False)
    otp = fields.CharField(max_length=6, null=True)
    otp_created_at = fields.DatetimeField(null=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    last_login = fields.DatetimeField(null=True)

    def __str__(self):
        return self.email

class Coupon(models.Model):
    id = fields.UUIDField(pk=True)
    barcode = fields.CharField(max_length=255)
    value = fields.DecimalField(max_digits=10, decimal_places=2, null=True)
    currency = fields.CharField(max_length=3, default="EUR")
    user = fields.ForeignKeyField("models.User", related_name="coupons")
    is_used = fields.BooleanField(default=False)
    scanned_at = fields.DatetimeField(auto_now_add=True)
    used_at = fields.DatetimeField(null=True)
    
    def __str__(self):
        return f"{self.barcode} ({self.value} {self.currency})"

# Pydantic models for API responses
User_Pydantic = pydantic_model_creator(User, name="User", exclude=("created_at", "password_hash", "otp", "otp_created_at"))
UserCreate_Pydantic = pydantic_model_creator(User, name="UserCreate", exclude_readonly=True, exclude=("is_verified", "otp", "otp_created_at"))

Coupon_Pydantic = pydantic_model_creator(Coupon, name="Coupon")
CouponCreate_Pydantic = pydantic_model_creator(Coupon, name="CouponCreate", exclude_readonly=True, exclude=("is_used", "used_at"))
