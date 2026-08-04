from dataclasses import asdict
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.engine.calculations import months_until
from app.engine.financial_engine import FinancialEngine
from app.models.goal import Goal
from app.models.user import User
from app.schemas.dashboard import DashboardResponse, DashboardSummaryResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


def _build_engine(user: User, goals: list[Goal]) -> FinancialEngine:
    goal_dicts = [
        {
            "title": g.title,
            "target_amount": float(g.target_amount),
            "current_amount": float(g.current_amount),
            "months_until_deadline": months_until(g.deadline),
        }
        for g in goals
    ]
    return FinancialEngine(
        monthly_income=float(user.monthly_income),
        monthly_expenses=float(user.monthly_expenses),
        current_savings=float(user.current_savings),
        goals=goal_dicts,
    )


@router.get("", response_model=DashboardResponse)
def get_dashboard(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    goals = db.query(Goal).filter(Goal.user_id == current_user.id).all()
    engine = _build_engine(current_user, goals)
    result = engine.run()

    return DashboardResponse(
        safe_to_spend=asdict(result.safe_to_spend),
        savings_allocation=asdict(result.savings_allocation),
        emergency_fund=asdict(result.emergency_fund),
        goal_projections=[asdict(g) for g in result.goal_projections],
        confidence=asdict(result.confidence),
        budget_health=asdict(result.budget_health),
        monthly_income=float(current_user.monthly_income),
        monthly_expenses=float(current_user.monthly_expenses),
        current_savings=float(current_user.current_savings),
    )


@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    goals = db.query(Goal).filter(Goal.user_id == current_user.id).all()
    engine = _build_engine(current_user, goals)
    result = engine.run()

    on_track = sum(1 for g in result.goal_projections if g.on_track)

    return DashboardSummaryResponse(
        safe_to_spend_weekly=result.safe_to_spend.weekly,
        confidence_score=result.confidence.overall,
        budget_health_label=result.budget_health.label,
        emergency_fund_pct=result.emergency_fund.progress_pct,
        goals_on_track=on_track,
        goals_total=len(result.goal_projections),
    )
