from __future__ import annotations

from app.engine.calculations import (
    calculate_disposable_income,
    calculate_emergency_fund,
    calculate_goal_projection,
    calculate_safe_to_spend,
    calculate_savings_allocation,
)
from app.engine.schemas import (
    EngineResult,
    FinancialInput,
    GoalInput,
)
from app.engine.scoring import calculate_budget_health, calculate_confidence_score


class FinancialEngine:
    def __init__(
        self,
        monthly_income: float,
        monthly_expenses: float,
        current_savings: float,
        goals: list[dict] | None = None,
    ) -> None:
        self.fin = FinancialInput(
            monthly_income=monthly_income,
            monthly_expenses=monthly_expenses,
            current_savings=current_savings,
        )
        self.goals = goals or []

    def run(self) -> EngineResult:
        disposable = calculate_disposable_income(self.fin)
        emergency_fund = calculate_emergency_fund(self.fin)

        goal_projections = []
        total_goal_contribution = 0.0

        for g in self.goals:
            goal_input = GoalInput(
                title=g["title"],
                target_amount=g["target_amount"],
                current_amount=g["current_amount"],
                months_until_deadline=g.get("months_until_deadline", 12),
            )
            remaining = max(goal_input.target_amount - goal_input.current_amount, 0.0)
            months_left = max(goal_input.months_until_deadline, 1)
            monthly_contribution = remaining / months_left if months_left > 0 else 0.0
            total_goal_contribution += monthly_contribution

            projection = calculate_goal_projection(goal_input, monthly_contribution)
            goal_projections.append(projection)

        allocation = calculate_savings_allocation(self.fin, total_goal_contribution)
        safe_to_spend = calculate_safe_to_spend(self.fin, allocation)
        confidence = calculate_confidence_score(self.fin, emergency_fund, goal_projections)
        budget_health = calculate_budget_health(self.fin)

        return EngineResult(
            disposable=disposable,
            safe_to_spend=safe_to_spend,
            savings_allocation=allocation,
            emergency_fund=emergency_fund,
            goal_projections=goal_projections,
            confidence=confidence,
            budget_health=budget_health,
        )
