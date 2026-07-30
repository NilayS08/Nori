from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.onboarding import OnboardingRequest, OnboardingResponse
from app.services.onboarding import get_onboarding, save_onboarding

router = APIRouter(prefix="/onboarding", tags=["Onboarding"])


@router.post("", response_model=OnboardingResponse)
def create_onboarding(
    payload: OnboardingRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    if current_user.is_onboarded:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already onboarded",
        )
    return save_onboarding(current_user, payload, db)


@router.get("", response_model=OnboardingResponse)
def read_onboarding(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    return get_onboarding(current_user, db)


@router.put("", response_model=OnboardingResponse)
def update_onboarding(
    payload: OnboardingRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    return save_onboarding(current_user, payload, db)
