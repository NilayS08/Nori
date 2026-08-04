export interface Goal {
  id: number;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  created_at: string;
  updated_at: string;
  remaining: number;
  progress_pct: number;
  months_until_deadline: number;
  monthly_contribution: number;
  months_to_complete: number;
  on_track: boolean;
}

export interface GoalCreateRequest {
  title: string;
  target_amount: number;
  current_amount?: number;
  deadline: string;
}

export interface GoalUpdateRequest {
  title?: string;
  target_amount?: number;
  current_amount?: number;
  deadline?: string;
}
