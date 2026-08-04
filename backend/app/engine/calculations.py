from __future__ import annotations

from app.engine.schemas import (
    DisposableIncomeResult,
    EmergencyFundResult,
    FinancialInput,
    GoalInput,
    GoalProjectionResult,
    SafeToSpendResult,
    SavingsAllocationResult,
)


def calculate_disposable_income(fin: FinancialInput) -> DisposableIncomeResult:
    monthly = max(fin.monthly_income - fin.monthly_expenses, 0.0)
    return DisposableIncomeResult(monthly_disposable=monthly, weekly_disposable=monthly / 4)


def calculate_emergency_fund(
    fin: FinancialInput,
    months_target: int = 6,
) -> EmergencyFundResult:
    target = fin.monthly_expenses * months_target
    progress = (fin.current_savings / target * 100) if target > 0 else 100.0
    is_funded = fin.current_savings >= target

    if is_funded:
        monthly_needed = 0.0
        months_to_fund = 0
    else:
        shortfall = target - fin.current_savings
        disposable = max(fin.monthly_income - fin.monthly_expenses, 0.0)
        if disposable > 0:
            monthly_needed = min(shortfall, disposable * 0.5)
            months_to_fund = int(-(-shortfall // monthly_needed)) if monthly_needed > 0 else 999
        else:
            monthly_needed = 0.0
            months_to_fund = 999

    return EmergencyFundResult(
        target_amount=target,
        current_amount=fin.current_savings,
        progress_pct=min(progress, 100.0),
        is_funded=is_funded,
        monthly_contribution_needed=monthly_needed,
        months_to_fund=months_to_fund,
    )


def calculate_goal_projection(
    goal: GoalInput,
    monthly_contribution: float,
) -> GoalProjectionResult:
    remaining = max(goal.target_amount - goal.current_amount, 0.0)
    if monthly_contribution > 0:
        months = int(-(-remaining // monthly_contribution))
    else:
        months = 999
    on_track = months <= goal.months_until_deadline
    return GoalProjectionResult(
        title=goal.title,
        target_amount=goal.target_amount,
        current_amount=goal.current_amount,
        monthly_contribution=monthly_contribution,
        months_to_complete=months,
        on_track=on_track,
    )


def calculate_savings_allocation(
    fin: FinancialInput,
    goal_contributions_total: float,
    emergency_fund_target: float = 6.0,
) -> SavingsAllocationResult:
    disposable = max(fin.monthly_income - fin.monthly_expenses, 0.0)
    emergency_target = fin.monthly_expenses * emergency_fund_target
    emergency_shortfall = max(emergency_target - fin.current_savings, 0.0)

    if emergency_shortfall > 0:
        emergency_contribution = min(emergency_shortfall, disposable * 0.5)
    else:
        emergency_contribution = 0.0
    available_after_emergency = max(disposable - emergency_contribution, 0.0)
    actual_goal_contributions = min(goal_contributions_total, available_after_emergency)

    total = emergency_contribution + actual_goal_contributions
    remaining = max(disposable - total, 0.0)

    return SavingsAllocationResult(
        emergency_fund_contribution=emergency_contribution,
        goal_contributions=actual_goal_contributions,
        total_savings=total,
        remaining_disposable=remaining,
    )


def calculate_safe_to_spend(
    fin: FinancialInput,
    savings_allocation: SavingsAllocationResult,
) -> SafeToSpendResult:
    monthly = savings_allocation.remaining_disposable
    return SafeToSpendResult(monthly=monthly, weekly=monthly / 4, daily=monthly / 30)
