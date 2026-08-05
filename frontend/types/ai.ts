export type WhatIfScenarioType =
  | "increase_income"
  | "increase_expenses"
  | "one_time_purchase"
  | "one_time_gain";

export interface FinancialContext {
  income: { monthly: number };
  expenses: { monthly: number };
  savings: { current: number };
  safe_to_spend: { monthly: number; weekly: number; daily: number };
  disposable: { monthly: number };
  emergency_fund: {
    target: number;
    current: number;
    progress_pct: number;
    funded: boolean;
  };
  goals: Array<{
    title: string;
    target_amount: number;
    current_amount: number;
    monthly_contribution: number;
    months_to_complete: number;
    on_track: boolean;
  }>;
  confidence_score: number;
  budget_health: string;
}

export interface PurchaseAdviceRequest {
  amount: number;
  description?: string | null;
}

export interface PurchaseAdviceResponse {
  amount: number;
  description: string | null;
  context: FinancialContext & {
    purchase: {
      amount: number;
      within_weekly_budget: boolean;
      remaining_after_purchase: number;
    };
  };
  advice: string | null;
}

export interface WeeklySummaryStats {
  checkins: number;
  total_spent: number;
  weekly_budget: number;
  over_budget: boolean;
  vs_budget_pct: number;
  average_per_day: number;
  notes_count: number;
}

export interface WeeklySummaryResponse {
  period: string;
  stats: WeeklySummaryStats;
  summary: string | null;
}

export interface WhatIfRequest {
  scenario_type: WhatIfScenarioType;
  amount: number;
  description?: string | null;
}

export interface FinancialSnapshot {
  safe_to_spend: { monthly: number; weekly: number; daily: number };
  emergency_fund: {
    target_amount: number;
    current_amount: number;
    progress_pct: number;
    is_funded: boolean;
    monthly_contribution_needed: number;
    months_to_fund: number;
  };
  confidence_score: number;
  budget_health: string;
  goals: Array<{
    title: string;
    target_amount: number;
    current_amount: number;
    monthly_contribution: number;
    months_to_complete: number;
    on_track: boolean;
  }>;
}

export interface WhatIfDiff {
  safe_to_spend_weekly: { baseline: number; simulated: number; change: number };
  emergency_fund_progress_pct: {
    baseline: number;
    simulated: number;
    change: number;
  };
  confidence_score: { baseline: number; simulated: number; change: number };
  goals_on_track: { baseline: number; simulated: number };
}

export interface WhatIfResponse {
  scenario_type: WhatIfScenarioType;
  amount: number;
  description: string | null;
  baseline: FinancialSnapshot;
  simulation: FinancialSnapshot;
  diff: WhatIfDiff;
  recommendation: string | null;
}

export interface GoalExplanationResponse {
  goal: {
    title: string;
    target_amount: number;
    current_amount: number;
    deadline: string;
    remaining: number;
    progress_pct: number;
    months_until_deadline: number;
    monthly_contribution: number;
    months_to_complete: number;
    on_track: boolean;
  };
  context: FinancialContext;
  explanation: string | null;
}
