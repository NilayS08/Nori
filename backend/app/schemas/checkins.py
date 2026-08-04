from datetime import datetime

from pydantic import BaseModel, Field


class CheckInCreate(BaseModel):
    amount_spent: float = Field(default=0.00, ge=0)
    notes: str | None = Field(default=None, max_length=500)


class CheckInResponse(BaseModel):
    id: int
    amount_spent: float
    notes: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
