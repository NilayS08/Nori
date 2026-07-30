from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    name: str = Field(min_length=1, max_length=255)
    user_type: str = Field(default="personal", max_length=50)
    monthly_income: float = Field(default=0.00, ge=0)
    monthly_expenses: float = Field(default=0.00, ge=0)
    current_savings: float = Field(default=0.00, ge=0)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    user_type: str
    monthly_income: float
    monthly_expenses: float
    current_savings: float
    is_onboarded: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    refresh_token: str
