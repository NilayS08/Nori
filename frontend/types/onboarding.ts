export interface Goal {
  id: number;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  created_at: string;
}

export interface OnboardingRequest {
  user_type: string;
  monthly_income: number;
  monthly_expenses: number;
  current_savings: number;
  goal_title: string;
  goal_target_amount: number;
  goal_deadline: string;
}

export interface OnboardingResponse {
  is_onboarded: boolean;
  user_type: string;
  monthly_income: number;
  monthly_expenses: number;
  current_savings: number;
  goal: Goal | null;
}
