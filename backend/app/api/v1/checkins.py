from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.checkins import CheckInCreate, CheckInResponse
from app.services.checkins import create_checkin, get_latest_checkin, list_checkins

router = APIRouter(prefix="/checkins", tags=["Check-ins"])


@router.get("", response_model=list[CheckInResponse])
def read_checkins(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    return list_checkins(current_user, db)


@router.post("", response_model=CheckInResponse, status_code=status.HTTP_201_CREATED)
def create_checkin_endpoint(
    payload: CheckInCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    return create_checkin(current_user, payload, db)


@router.get("/latest", response_model=CheckInResponse | None)
def read_latest_checkin(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    return get_latest_checkin(current_user, db)
