export interface User {
  id: number;
  email: string;
  name: string;
  user_type: string;
  monthly_income: number;
  monthly_expenses: number;
  current_savings: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  user_type?: string;
  monthly_income?: number;
  monthly_expenses?: number;
  current_savings?: number;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
