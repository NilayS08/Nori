from datetime import date, datetime

from pydantic import BaseModel, Field


class GoalResponse(BaseModel):
    id: int
    title: str
    target_amount: float
    current_amount: float
    deadline: date
    created_at: datetime

    model_config = {"from_attributes": True}


class OnboardingRequest(BaseModel):
    user_type: str = Field(default="personal", max_length=50)
    monthly_income: float = Field(default=0.00, ge=0)
    monthly_expenses: float = Field(default=0.00, ge=0)
    current_savings: float = Field(default=0.00, ge=0)
    goal_title: str = Field(default="My Savings Goal", max_length=255)
    goal_target_amount: float = Field(ge=0)
    goal_deadline: date


class OnboardingResponse(BaseModel):
    is_onboarded: bool
    user_type: str
    monthly_income: float
    monthly_expenses: float
    current_savings: float
    goal: GoalResponse | None = None


class OnboardingStatusResponse(BaseModel):
    is_onboarded: bool
