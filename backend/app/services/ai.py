from __future__ import annotations

from dataclasses import asdict
from datetime import UTC, datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.ai.base import AIProvider
from app.ai.factory import get_ai_provider
from app.ai.prompts import (
    SYSTEM_INSTRUCTION,
    goal_explanation_prompt,
    purchase_advice_prompt,
    weekly_summary_prompt,
    what_if_prompt,
)
from app.engine.calculations import months_until
from app.engine.financial_engine import FinancialEngine
from app.engine.schemas import EngineResult
from app.models.checkin import CheckIn
from app.models.goal import Goal
from app.models.user import User
from app.schemas.ai import (
    GoalExplanationResponse,
    PurchaseAdviceRequest,
    PurchaseAdviceResponse,
    WeeklySummaryResponse,
    WhatIfRequest,
    WhatIfResponse,
)
from app.services.goals import calculate_goal_progress, get_owned_goal


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


def build_financial_context(user: User, goals: list[Goal]) -> dict:
    result = _build_engine(user, goals).run()
    return {
        "income": {"monthly": round(float(user.monthly_income), 2)},
        "expenses": {"monthly": round(float(user.monthly_expenses), 2)},
        "savings": {"current": round(float(user.current_savings), 2)},
        "safe_to_spend": {
            "monthly": round(result.safe_to_spend.monthly, 2),
            "weekly": round(result.safe_to_spend.weekly, 2),
            "daily": round(result.safe_to_spend.daily, 2),
        },
        "disposable": {"monthly": round(result.disposable.monthly_disposable, 2)},
        "emergency_fund": {
            "target": round(result.emergency_fund.target_amount, 2),
            "current": round(result.emergency_fund.current_amount, 2),
            "progress_pct": round(result.emergency_fund.progress_pct, 1),
            "funded": result.emergency_fund.is_funded,
        },
        "goals": [
            {
                "title": g.title,
                "target_amount": round(g.target_amount, 2),
                "current_amount": round(g.current_amount, 2),
                "monthly_contribution": round(g.monthly_contribution, 2),
                "months_to_complete": g.months_to_complete,
                "on_track": g.on_track,
            }
            for g in result.goal_projections
        ],
        "confidence_score": round(result.confidence.overall, 1),
        "budget_health": result.budget_health.label,
    }


def start_of_week_utc(dt: datetime) -> datetime:
    """Monday 00:00 UTC for the week containing ``dt``."""
    return (dt - timedelta(days=dt.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)


def compute_weekly_stats(checkins: list[CheckIn], weekly_budget: float) -> dict:
    total = round(sum(float(c.amount_spent) for c in checkins), 2)
    count = len(checkins)
    return {
        "checkins": count,
        "total_spent": total,
        "weekly_budget": round(weekly_budget, 2),
        "over_budget": total > weekly_budget,
        "vs_budget_pct": round((total / weekly_budget * 100), 1) if weekly_budget > 0 else 0.0,
        "average_per_day": round(total / 7, 2) if count else 0.0,
        "notes_count": sum(1 for c in checkins if c.notes),
    }


def serialize_engine(result: EngineResult) -> dict:
    return {
        "safe_to_spend": asdict(result.safe_to_spend),
        "emergency_fund": asdict(result.emergency_fund),
        "confidence_score": result.confidence.overall,
        "budget_health": result.budget_health.label,
        "goals": [asdict(g) for g in result.goal_projections],
    }


def run_what_if(
    user: User,
    goals: list[Goal],
    payload: WhatIfRequest,
) -> tuple[EngineResult, EngineResult]:
    baseline = _build_engine(user, goals).run()

    scenario_inputs = {
        "monthly_income": float(user.monthly_income),
        "monthly_expenses": float(user.monthly_expenses),
        "current_savings": float(user.current_savings),
    }
    if payload.scenario_type == "increase_income":
        scenario_inputs["monthly_income"] += payload.amount
    elif payload.scenario_type == "increase_expenses":
        scenario_inputs["monthly_expenses"] += payload.amount
    elif payload.scenario_type == "one_time_purchase":
        remaining = scenario_inputs["current_savings"] - payload.amount
        scenario_inputs["current_savings"] = max(remaining, 0.0)
    elif payload.scenario_type == "one_time_gain":
        scenario_inputs["current_savings"] += payload.amount

    goal_dicts = [
        {
            "title": g.title,
            "target_amount": float(g.target_amount),
            "current_amount": float(g.current_amount),
            "months_until_deadline": months_until(g.deadline),
        }
        for g in goals
    ]
    simulation = FinancialEngine(goals=goal_dicts, **scenario_inputs).run()
    return baseline, simulation


def compute_what_if_diff(baseline: EngineResult, simulation: EngineResult) -> dict:
    return {
        "safe_to_spend_weekly": {
            "baseline": round(baseline.safe_to_spend.weekly, 2),
            "simulated": round(simulation.safe_to_spend.weekly, 2),
            "change": round(simulation.safe_to_spend.weekly - baseline.safe_to_spend.weekly, 2),
        },
        "emergency_fund_progress_pct": {
            "baseline": round(baseline.emergency_fund.progress_pct, 1),
            "simulated": round(simulation.emergency_fund.progress_pct, 1),
            "change": round(
                simulation.emergency_fund.progress_pct - baseline.emergency_fund.progress_pct, 1
            ),
        },
        "confidence_score": {
            "baseline": round(baseline.confidence.overall, 1),
            "simulated": round(simulation.confidence.overall, 1),
            "change": round(simulation.confidence.overall - baseline.confidence.overall, 1),
        },
        "goals_on_track": {
            "baseline": sum(1 for g in baseline.goal_projections if g.on_track),
            "simulated": sum(1 for g in simulation.goal_projections if g.on_track),
        },
    }


def _generate(provider: AIProvider | None, prompt: str) -> str | None:
    try:
        active = provider or get_ai_provider()
        return active.generate(prompt, SYSTEM_INSTRUCTION)
    except Exception:
        return None


def purchase_advice(
    user: User,
    db: Session,
    payload: PurchaseAdviceRequest,
    provider: AIProvider | None = None,
) -> PurchaseAdviceResponse:
    goals = db.execute(select(Goal).where(Goal.user_id == user.id)).scalars().all()
    context = build_financial_context(user, goals)
    weekly = context["safe_to_spend"]["weekly"]
    context["purchase"] = {
        "amount": round(payload.amount, 2),
        "within_weekly_budget": payload.amount <= weekly,
        "remaining_after_purchase": round(weekly - payload.amount, 2),
    }
    prompt = purchase_advice_prompt(context, payload.amount, payload.description)
    return PurchaseAdviceResponse(
        amount=payload.amount,
        description=payload.description,
        context=context,
        advice=_generate(provider, prompt),
    )


def weekly_summary(
    user: User,
    db: Session,
    provider: AIProvider | None = None,
) -> WeeklySummaryResponse:
    now = datetime.now(UTC)
    week_start = start_of_week_utc(now)
    checkins = (
        db.execute(
            select(CheckIn)
            .where(CheckIn.user_id == user.id, CheckIn.created_at >= week_start)
            .order_by(CheckIn.created_at.asc())
        )
        .scalars()
        .all()
    )
    goals = db.execute(select(Goal).where(Goal.user_id == user.id)).scalars().all()
    result = _build_engine(user, goals).run()
    stats = compute_weekly_stats(checkins, result.safe_to_spend.weekly)

    period = f"{week_start.date()} to {now.date()}"
    prompt = weekly_summary_prompt(stats)
    return WeeklySummaryResponse(
        period=period,
        stats=stats,
        summary=_generate(provider, prompt),
    )


def what_if(
    user: User,
    db: Session,
    payload: WhatIfRequest,
    provider: AIProvider | None = None,
) -> WhatIfResponse:
    goals = db.execute(select(Goal).where(Goal.user_id == user.id)).scalars().all()
    baseline, simulation = run_what_if(user, goals, payload)
    diff = compute_what_if_diff(baseline, simulation)

    labels = {
        "increase_income": "a monthly income increase",
        "increase_expenses": "higher monthly expenses",
        "one_time_purchase": "a one-time purchase",
        "one_time_gain": "a one-time gain",
    }
    description = payload.description or f"{labels[payload.scenario_type]} of {payload.amount:,.2f}"

    prompt = what_if_prompt(
        serialize_engine(baseline),
        serialize_engine(simulation),
        diff,
        description,
    )
    return WhatIfResponse(
        scenario_type=payload.scenario_type,
        amount=payload.amount,
        description=description,
        baseline=serialize_engine(baseline),
        simulation=serialize_engine(simulation),
        diff=diff,
        recommendation=_generate(provider, prompt),
    )


def goal_explanation(
    user: User,
    db: Session,
    goal_id: int,
    provider: AIProvider | None = None,
) -> GoalExplanationResponse:
    goal = get_owned_goal(goal_id, user, db)
    goal_data = {
        "title": goal.title,
        "target_amount": float(goal.target_amount),
        "current_amount": float(goal.current_amount),
        "deadline": goal.deadline.isoformat(),
        **calculate_goal_progress(goal),
    }
    goals = db.execute(select(Goal).where(Goal.user_id == user.id)).scalars().all()
    context = build_financial_context(user, goals)
    prompt = goal_explanation_prompt(goal_data, context)
    return GoalExplanationResponse(
        goal=goal_data,
        context=context,
        explanation=_generate(provider, prompt),
    )
