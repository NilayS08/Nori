from datetime import date, datetime

from pydantic import BaseModel, Field, field_validator


def _ensure_future_deadline(value: date) -> date:
    if value < date.today():
        raise ValueError("Deadline must be in the future")
    return value


class GoalCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    target_amount: float = Field(gt=0)
    current_amount: float = Field(default=0.00, ge=0)
    deadline: date

    _validate_deadline = field_validator("deadline")(_ensure_future_deadline)


class GoalUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    target_amount: float | None = Field(default=None, gt=0)
    current_amount: float | None = Field(default=None, ge=0)
    deadline: date | None = None

    _validate_deadline = field_validator("deadline")(_ensure_future_deadline)


class GoalResponse(BaseModel):
    id: int
    title: str
    target_amount: float
    current_amount: float
    deadline: date
    created_at: datetime
    updated_at: datetime
    remaining: float
    progress_pct: float
    months_until_deadline: int
    monthly_contribution: float
    months_to_complete: int
    on_track: bool

    model_config = {"from_attributes": True}
