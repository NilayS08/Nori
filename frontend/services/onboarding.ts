import { api } from "@/lib/api";
import type { OnboardingRequest, OnboardingResponse } from "@/types/onboarding";

export async function createOnboarding(data: OnboardingRequest): Promise<OnboardingResponse> {
  const response = await api.post<OnboardingResponse>("/onboarding", data);
  return response.data;
}

export async function getOnboarding(): Promise<OnboardingResponse> {
  const response = await api.get<OnboardingResponse>("/onboarding");
  return response.data;
}
