from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.goal import Goal
from app.models.user import User
from app.schemas.onboarding import OnboardingRequest, OnboardingResponse


def save_onboarding(
    user: User,
    payload: OnboardingRequest,
    db: Session,
) -> OnboardingResponse:
    user.user_type = payload.user_type
    user.monthly_income = payload.monthly_income
    user.monthly_expenses = payload.monthly_expenses
    user.current_savings = payload.current_savings
    user.is_onboarded = True

    goal = Goal(
        user_id=user.id,
        title=payload.goal_title,
        target_amount=payload.goal_target_amount,
        current_amount=0.00,
        deadline=payload.goal_deadline,
    )
    db.add(goal)
    db.commit()
    db.refresh(user)
    db.refresh(goal)

    return OnboardingResponse(
        is_onboarded=True,
        user_type=user.user_type,
        monthly_income=float(user.monthly_income),
        monthly_expenses=float(user.monthly_expenses),
        current_savings=float(user.current_savings),
        goal=goal,
    )


def get_onboarding(
    user: User,
    db: Session,
) -> OnboardingResponse:
    goal = db.execute(
        select(Goal).where(Goal.user_id == user.id).order_by(Goal.created_at.desc())
    ).scalar_one_or_none()

    return OnboardingResponse(
        is_onboarded=user.is_onboarded,
        user_type=user.user_type,
        monthly_income=float(user.monthly_income),
        monthly_expenses=float(user.monthly_expenses),
        current_savings=float(user.current_savings),
        goal=goal,
    )


def get_onboarding_status(
    user: User,
    db: Session,
) -> bool:
    return user.is_onboarded
