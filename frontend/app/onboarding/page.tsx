"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { StepGoal } from "@/components/onboarding/StepGoal";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { StepPersonal } from "@/components/onboarding/StepPersonal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { createOnboarding } from "@/services/onboarding";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    user_type: "personal",
    monthly_income: "",
    monthly_expenses: "",
    current_savings: "",
    goal_title: "My Savings Goal",
    goal_target_amount: "",
    goal_deadline: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </main>
    );
  }

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      await createOnboarding({
        user_type: form.user_type,
        monthly_income: Number(form.monthly_income) || 0,
        monthly_expenses: Number(form.monthly_expenses) || 0,
        current_savings: Number(form.current_savings) || 0,
        goal_title: form.goal_title,
        goal_target_amount: Number(form.goal_target_amount) || 0,
        goal_deadline: form.goal_deadline,
      });
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <Card size="sm" className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-xl">Set up your finances</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <StepIndicator current={step} />

          {error && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          {step === 1 && <StepPersonal data={form} onChange={updateField} />}
          {step === 2 && <StepGoal data={form} onChange={updateField} />}

          <div className="flex gap-2">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            {step < 2 ? (
              <Button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex-1"
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? "Saving…" : "Complete setup"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
