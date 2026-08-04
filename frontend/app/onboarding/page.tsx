"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/Logo";
import { StepGoal } from "@/components/onboarding/StepGoal";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { StepPersonal } from "@/components/onboarding/StepPersonal";
import { Button } from "@/components/ui/button";
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
    <main className="ambient relative flex min-h-dvh items-center justify-center overflow-hidden bg-background p-4">
      <div className="relative z-10 flex w-full max-w-[480px] flex-col items-center gap-8">
        <Logo />

        <div className="glass w-full rounded-[24px] p-8 shadow-soft">
          <div className="mb-6">
            <StepIndicator current={step} />
          </div>

          {error && (
            <div className="mb-6 rounded-[12px] bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
              {error}
            </div>
          )}

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && <StepPersonal data={form} onChange={updateField} />}
            {step === 2 && <StepGoal data={form} onChange={updateField} />}
          </motion.div>

          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <Button
                type="button"
                variant="ghost"
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
                {submitting ? "Saving…" : "See my Safe To Spend"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
