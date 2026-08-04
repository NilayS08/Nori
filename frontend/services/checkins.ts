import { api } from "@/lib/api";
import type { CheckIn, CheckInCreateRequest } from "@/types/checkins";

export async function getCheckIns(): Promise<CheckIn[]> {
  const response = await api.get<CheckIn[]>("/checkins");
  return response.data;
}

export async function getLatestCheckIn(): Promise<CheckIn | null> {
  const response = await api.get<CheckIn | null>("/checkins/latest");
  return response.data;
}

export async function createCheckIn(data: CheckInCreateRequest): Promise<CheckIn> {
  const response = await api.post<CheckIn>("/checkins", data);
  return response.data;
}
