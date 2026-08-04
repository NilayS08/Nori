from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.engine.calculations import calculate_goal_projection, months_until
from app.engine.schemas import GoalInput
from app.models.goal import Goal
from app.models.user import User
from app.schemas.goals import GoalCreate, GoalResponse, GoalUpdate


def calculate_goal_progress(goal: Goal) -> dict:
    """Deterministic progress calculation for a single goal."""
    target = float(goal.target_amount)
    current = float(goal.current_amount)
    remaining = max(target - current, 0.0)
    progress_pct = (current / target * 100) if target > 0 else 0.0
    months_left = months_until(goal.deadline)

    if remaining > 0:
        monthly_contribution = remaining / months_left
        projection = calculate_goal_projection(
            GoalInput(
                title=goal.title,
                target_amount=target,
                current_amount=current,
                months_until_deadline=months_left,
            ),
            monthly_contribution,
        )
        months_to_complete = projection.months_to_complete
        on_track = projection.on_track
    else:
        monthly_contribution = 0.0
        months_to_complete = 0
        on_track = True

    return {
        "remaining": round(remaining, 2),
        "progress_pct": round(progress_pct, 1),
        "months_until_deadline": months_left,
        "monthly_contribution": round(monthly_contribution, 2),
        "months_to_complete": months_to_complete,
        "on_track": on_track,
    }


def build_goal_response(goal: Goal) -> GoalResponse:
    return GoalResponse(
        id=goal.id,
        title=goal.title,
        target_amount=float(goal.target_amount),
        current_amount=float(goal.current_amount),
        deadline=goal.deadline,
        created_at=goal.created_at,
        updated_at=goal.updated_at,
        **calculate_goal_progress(goal),
    )


def get_owned_goal(goal_id: int, user: User, db: Session) -> Goal:
    goal = db.execute(
        select(Goal).where(Goal.id == goal_id, Goal.user_id == user.id)
    ).scalar_one_or_none()
    if goal is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found",
        )
    return goal


def list_goals(user: User, db: Session) -> list[GoalResponse]:
    goals = (
        db.execute(
            select(Goal)
            .where(Goal.user_id == user.id)
            .order_by(Goal.deadline.asc(), Goal.created_at.asc())
        )
        .scalars()
        .all()
    )
    return [build_goal_response(goal) for goal in goals]


def get_goal(goal_id: int, user: User, db: Session) -> GoalResponse:
    return build_goal_response(get_owned_goal(goal_id, user, db))


def create_goal(user: User, payload: GoalCreate, db: Session) -> GoalResponse:
    goal = Goal(
        user_id=user.id,
        title=payload.title,
        target_amount=payload.target_amount,
        current_amount=payload.current_amount,
        deadline=payload.deadline,
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return build_goal_response(goal)


def update_goal(
    goal_id: int,
    user: User,
    payload: GoalUpdate,
    db: Session,
) -> GoalResponse:
    goal = get_owned_goal(goal_id, user, db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(goal, field, value)
    db.commit()
    db.refresh(goal)
    return build_goal_response(goal)


def delete_goal(goal_id: int, user: User, db: Session) -> None:
    goal = get_owned_goal(goal_id, user, db)
    db.delete(goal)
    db.commit()
