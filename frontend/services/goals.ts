import { api } from "@/lib/api";
import type {
  Goal,
  GoalCreateRequest,
  GoalUpdateRequest,
} from "@/types/goals";

export async function getGoals(): Promise<Goal[]> {
  const response = await api.get<Goal[]>("/goals");
  return response.data;
}

export async function getGoal(id: number): Promise<Goal> {
  const response = await api.get<Goal>(`/goals/${id}`);
  return response.data;
}

export async function createGoal(data: GoalCreateRequest): Promise<Goal> {
  const response = await api.post<Goal>("/goals", data);
  return response.data;
}

export async function updateGoal(
  id: number,
  data: GoalUpdateRequest,
): Promise<Goal> {
  const response = await api.put<Goal>(`/goals/${id}`, data);
  return response.data;
}

export async function deleteGoal(id: number): Promise<void> {
  await api.delete(`/goals/${id}`);
}
