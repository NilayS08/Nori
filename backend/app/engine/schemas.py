from __future__ import annotations

from dataclasses import dataclass


@dataclass
class FinancialInput:
    monthly_income: float
    monthly_expenses: float
    current_savings: float


@dataclass
class GoalInput:
    title: str
    target_amount: float
    current_amount: float
    months_until_deadline: int


@dataclass
class DisposableIncomeResult:
    monthly_disposable: float
    weekly_disposable: float


@dataclass
class EmergencyFundResult:
    target_amount: float
    current_amount: float
    progress_pct: float
    is_funded: bool
    monthly_contribution_needed: float
    months_to_fund: int


@dataclass
class GoalProjectionResult:
    title: str
    target_amount: float
    current_amount: float
    monthly_contribution: float
    months_to_complete: int
    on_track: bool


@dataclass
class SavingsAllocationResult:
    emergency_fund_contribution: float
    goal_contributions: float
    total_savings: float
    remaining_disposable: float


@dataclass
class SafeToSpendResult:
    monthly: float
    weekly: float
    daily: float


@dataclass
class ConfidenceScoreResult:
    overall: float
    savings_rate: float
    emergency_fund_score: float
    goal_progress_score: float


@dataclass
class BudgetHealthResult:
    score: float
    expense_ratio: float
    savings_ratio: float
    label: str


@dataclass
class EngineResult:
    disposable: DisposableIncomeResult
    safe_to_spend: SafeToSpendResult
    savings_allocation: SavingsAllocationResult
    emergency_fund: EmergencyFundResult
    goal_projections: list[GoalProjectionResult]
    confidence: ConfidenceScoreResult
    budget_health: BudgetHealthResult
