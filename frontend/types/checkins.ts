export interface CheckIn {
  id: number;
  amount_spent: number;
  notes: string | null;
  created_at: string;
}

export interface CheckInCreateRequest {
  amount_spent: number;
  notes?: string | null;
}
