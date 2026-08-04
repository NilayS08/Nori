export interface SafeToSpend {
  monthly: number;
  weekly: number;
  daily: number;
}

export interface SavingsAllocation {
  emergency_fund_contribution: number;
  goal_contributions: number;
  total_savings: number;
  remaining_disposable: number;
}

export interface EmergencyFund {
  target_amount: number;
  current_amount: number;
  progress_pct: number;
  is_funded: boolean;
  monthly_contribution_needed: number;
  months_to_fund: number;
}

export interface GoalProjection {
  title: string;
  target_amount: number;
  current_amount: number;
  monthly_contribution: number;
  months_to_complete: number;
  on_track: boolean;
}

export interface ConfidenceScore {
  overall: number;
  savings_rate: number;
  emergency_fund_score: number;
  goal_progress_score: number;
}

export interface BudgetHealth {
  score: number;
  expense_ratio: number;
  savings_ratio: number;
  label: string;
}

export interface DashboardData {
  safe_to_spend: SafeToSpend;
  savings_allocation: SavingsAllocation;
  emergency_fund: EmergencyFund;
  goal_projections: GoalProjection[];
  confidence: ConfidenceScore;
  budget_health: BudgetHealth;
  monthly_income: number;
  monthly_expenses: number;
  current_savings: number;
}

export interface DashboardSummary {
  safe_to_spend_weekly: number;
  confidence_score: number;
  budget_health_label: string;
  emergency_fund_pct: number;
  goals_on_track: number;
  goals_total: number;
}
