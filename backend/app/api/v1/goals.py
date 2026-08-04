from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.goals import GoalCreate, GoalResponse, GoalUpdate
from app.services.goals import (
    create_goal,
    delete_goal,
    get_goal,
    list_goals,
    update_goal,
)

router = APIRouter(prefix="/goals", tags=["Goals"])


@router.get("", response_model=list[GoalResponse])
def read_goals(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    return list_goals(current_user, db)


@router.post("", response_model=GoalResponse, status_code=status.HTTP_201_CREATED)
def create_goal_endpoint(
    payload: GoalCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    return create_goal(current_user, payload, db)


@router.get("/{goal_id}", response_model=GoalResponse)
def read_goal(
    goal_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    return get_goal(goal_id, current_user, db)


@router.put("/{goal_id}", response_model=GoalResponse)
def update_goal_endpoint(
    goal_id: int,
    payload: GoalUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    return update_goal(goal_id, current_user, payload, db)


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal_endpoint(
    goal_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    delete_goal(goal_id, current_user, db)
