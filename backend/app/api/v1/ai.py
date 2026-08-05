from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.ai.rate_limiter import SlidingWindowRateLimiter
from app.api.deps import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.schemas.ai import (
    GoalExplanationResponse,
    PurchaseAdviceRequest,
    PurchaseAdviceResponse,
    WeeklySummaryResponse,
    WhatIfRequest,
    WhatIfResponse,
)
from app.services.ai import goal_explanation, purchase_advice, weekly_summary, what_if

router = APIRouter(prefix="/ai", tags=["AI"])

_rate_limiter = SlidingWindowRateLimiter(
    max_requests=settings.ai_rate_limit_per_minute,
    window_seconds=60,
)


def check_ai_rate_limit(
    current_user: Annotated[User, Depends(get_current_user)],
) -> None:
    if not _rate_limiter.allow(str(current_user.id)):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests. Please wait a minute and try again.",
        )


@router.post("/purchase-advice", response_model=PurchaseAdviceResponse)
def get_purchase_advice(
    payload: PurchaseAdviceRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[None, Depends(check_ai_rate_limit)] = None,
):
    return purchase_advice(current_user, db, payload)


@router.get("/weekly-summary", response_model=WeeklySummaryResponse)
def get_weekly_summary(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[None, Depends(check_ai_rate_limit)] = None,
):
    return weekly_summary(current_user, db)


@router.post("/what-if", response_model=WhatIfResponse)
def get_what_if(
    payload: WhatIfRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[None, Depends(check_ai_rate_limit)] = None,
):
    return what_if(current_user, db, payload)


@router.get("/goals/{goal_id}/explain", response_model=GoalExplanationResponse)
def get_goal_explanation(
    goal_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[None, Depends(check_ai_rate_limit)] = None,
):
    return goal_explanation(current_user, db, goal_id)
