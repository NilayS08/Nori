"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { BudgetHealthCard } from "@/components/dashboard/BudgetHealthCard";
import { ConfidenceScoreCard } from "@/components/dashboard/ConfidenceScoreCard";
import { EmergencyFundCard } from "@/components/dashboard/EmergencyFundCard";
import { GoalCard } from "@/components/dashboard/GoalCard";
import { HeroCard } from "@/components/dashboard/HeroCard";
import { Navbar } from "@/components/dashboard/Navbar";
import { SafeToSpendCard } from "@/components/dashboard/SafeToSpendCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getDashboard } from "@/services/dashboard";
import type { GoalProjection } from "@/types/dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();

  useEffect(() => {
    if (!authLoading && user && !user.is_onboarded) {
      router.push("/onboarding");
    }
  }, [user, authLoading, router]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    enabled: !!user && user.is_onboarded,
  });

  if (authLoading || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!user.is_onboarded) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-muted-foreground">Redirecting…</p>
      </div>
    );
  }

  return (
    <div className="ambient min-h-dvh bg-background">
      <Navbar name={user.name} onLogout={logout} />

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8">
        {isLoading && <LoadingState />}
        {error && <ErrorState />}
        {!isLoading && !error && data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <HeroCard
              safeToSpend={data.safe_to_spend}
              confidence={data.confidence}
              userName={user.name}
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <SafeToSpendCard safeToSpend={data.safe_to_spend} delay={0.05} />
              <EmergencyFundCard emergencyFund={data.emergency_fund} delay={0.1} />
              <ConfidenceScoreCard confidence={data.confidence} delay={0.15} />
              <BudgetHealthCard
                budgetHealth={data.budget_health}
                monthlyIncome={data.monthly_income}
                monthlyExpenses={data.monthly_expenses}
                delay={0.2}
              />
            </div>

            <GoalsSection goals={data.goal_projections} />
          </motion.div>
        )}
      </main>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-8">
      <div className="glass h-56 animate-pulse rounded-[24px]" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="glass h-44 animate-pulse rounded-[20px]" />
        <div className="glass h-44 animate-pulse rounded-[20px]" />
        <div className="glass h-44 animate-pulse rounded-[20px]" />
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <p className="text-muted-foreground">Unable to load your finances.</p>
      <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
        Retry
      </Button>
    </div>
  );
}

function GoalsSection({
  goals,
}: {
  goals: GoalProjection[];
}) {
  if (goals.length === 0) {
    return (
      <div className="glass flex flex-col items-center gap-3 rounded-[24px] p-10 text-center shadow-soft">
        <p className="text-lg font-medium">No goals yet</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Create your first goal to see your progress and stay motivated.
        </p>
        <Link href="/goals" className="mt-2">
          <Button size="sm">Create your first goal</Button>
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <h2 className="text-[28px] font-semibold tracking-tight">Goals</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal, i) => (
          <GoalCard key={goal.title} goal={goal} delay={0.1 + i * 0.05} />
        ))}
      </div>
    </section>
  );
}
