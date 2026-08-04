from __future__ import annotations

from app.engine.schemas import (
    BudgetHealthResult,
    ConfidenceScoreResult,
    EmergencyFundResult,
    FinancialInput,
    GoalProjectionResult,
)


def calculate_confidence_score(
    fin: FinancialInput,
    emergency_fund: EmergencyFundResult,
    goal_projections: list[GoalProjectionResult],
) -> ConfidenceScoreResult:
    income = fin.monthly_income
    savings_rate = ((income - fin.monthly_expenses) / income * 100) if income > 0 else 0.0
    savings_rate = max(min(savings_rate, 100.0), 0.0)

    emergency_fund_score = emergency_fund.progress_pct

    if goal_projections:
        progress_sum = 0.0
        for g in goal_projections:
            if g.target_amount > 0:
                progress_sum += min(g.current_amount / g.target_amount, 1.0) * 100
            else:
                progress_sum += 100.0
        goal_progress_score = progress_sum / len(goal_projections)
    else:
        goal_progress_score = 0.0

    overall = (savings_rate * 0.35) + (emergency_fund_score * 0.35) + (goal_progress_score * 0.30)
    overall = max(min(overall, 100.0), 0.0)

    return ConfidenceScoreResult(
        overall=round(overall, 1),
        savings_rate=round(savings_rate, 1),
        emergency_fund_score=round(emergency_fund_score, 1),
        goal_progress_score=round(goal_progress_score, 1),
    )


def calculate_budget_health(fin: FinancialInput) -> BudgetHealthResult:
    income = fin.monthly_income
    if income <= 0:
        return BudgetHealthResult(
            score=0.0, expense_ratio=1.0, savings_ratio=0.0, label="No income"
        )

    expense_ratio = fin.monthly_expenses / income
    savings_ratio = max(1.0 - expense_ratio, 0.0)
    score = max(min(savings_ratio * 100, 100.0), 0.0)

    if expense_ratio <= 0.5:
        label = "Excellent"
    elif expense_ratio <= 0.7:
        label = "Good"
    elif expense_ratio <= 0.9:
        label = "Fair"
    else:
        label = "Tight"

    return BudgetHealthResult(
        score=round(score, 1),
        expense_ratio=round(expense_ratio, 3),
        savings_ratio=round(savings_ratio, 3),
        label=label,
    )
