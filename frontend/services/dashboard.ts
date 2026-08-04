import { api } from "@/lib/api";
import type { DashboardData, DashboardSummary } from "@/types/dashboard";

export async function getDashboard(): Promise<DashboardData> {
  const response = await api.get<DashboardData>("/dashboard");
  return response.data;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await api.get<DashboardSummary>("/dashboard/summary");
  return response.data;
}
