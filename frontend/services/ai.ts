import { api } from "@/lib/api";
import type {
  GoalExplanationResponse,
  PurchaseAdviceRequest,
  PurchaseAdviceResponse,
  WhatIfRequest,
  WhatIfResponse,
  WeeklySummaryResponse,
} from "@/types/ai";

export async function getWeeklySummary(): Promise<WeeklySummaryResponse> {
  const response = await api.get<WeeklySummaryResponse>("/ai/weekly-summary");
  return response.data;
}

export async function getPurchaseAdvice(
  data: PurchaseAdviceRequest,
): Promise<PurchaseAdviceResponse> {
  const response = await api.post<PurchaseAdviceResponse>(
    "/ai/purchase-advice",
    data,
  );
  return response.data;
}

export async function getWhatIf(data: WhatIfRequest): Promise<WhatIfResponse> {
  const response = await api.post<WhatIfResponse>("/ai/what-if", data);
  return response.data;
}

export async function getGoalExplanation(
  goalId: number,
): Promise<GoalExplanationResponse> {
  const response = await api.get<GoalExplanationResponse>(
    `/ai/goals/${goalId}/explain`,
  );
  return response.data;
}
