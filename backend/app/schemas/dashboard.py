from pydantic import BaseModel


class GoalProjectionResponse(BaseModel):
    title: str
    target_amount: float
    current_amount: float
    monthly_contribution: float
    months_to_complete: int
    on_track: bool


class EmergencyFundResponse(BaseModel):
    target_amount: float
    current_amount: float
    progress_pct: float
    is_funded: bool
    monthly_contribution_needed: float
    months_to_fund: int


class ConfidenceScoreResponse(BaseModel):
    overall: float
    savings_rate: float
    emergency_fund_score: float
    goal_progress_score: float


class BudgetHealthResponse(BaseModel):
    score: float
    expense_ratio: float
    savings_ratio: float
    label: str


class SafeToSpendResponse(BaseModel):
    monthly: float
    weekly: float
    daily: float


class SavingsAllocationResponse(BaseModel):
    emergency_fund_contribution: float
    goal_contributions: float
    total_savings: float
    remaining_disposable: float


class DashboardResponse(BaseModel):
    safe_to_spend: SafeToSpendResponse
    savings_allocation: SavingsAllocationResponse
    emergency_fund: EmergencyFundResponse
    goal_projections: list[GoalProjectionResponse]
    confidence: ConfidenceScoreResponse
    budget_health: BudgetHealthResponse
    monthly_income: float
    monthly_expenses: float
    current_savings: float


class DashboardSummaryResponse(BaseModel):
    safe_to_spend_weekly: float
    confidence_score: float
    budget_health_label: str
    emergency_fund_pct: float
    goals_on_track: int
    goals_total: int
