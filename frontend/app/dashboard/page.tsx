"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { AIAssistantPanel } from "@/components/dashboard/AIAssistantPanel";
import { BudgetHealthCard } from "@/components/dashboard/BudgetHealthCard";
import { ConfidenceCard } from "@/components/dashboard/ConfidenceCard";
import { Navbar } from "@/components/dashboard/Navbar";
import { Orbs } from "@/components/dashboard/Orbs";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { SafeToSpendHero } from "@/components/dashboard/SafeToSpendHero";
import { SavingsGoalsCard } from "@/components/dashboard/SavingsGoalsCard";
import { WeeklyCheckIn } from "@/components/dashboard/WeeklyCheckIn";
import { WeeklySpendChart } from "@/components/dashboard/WeeklySpendChart";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getWeeklySummary } from "@/services/ai";
import { getCheckIns } from "@/services/checkins";
import { getDashboard } from "@/services/dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();

  useEffect(() => {
    if (!authLoading && user && !user.is_onboarded) {
      router.push("/onboarding");
    }
  }, [user, authLoading, router]);

  const enabled = !!user && user.is_onboarded;

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    enabled,
  });

  const { data: checkins } = useQuery({
    queryKey: ["checkins"],
    queryFn: getCheckIns,
    enabled,
  });

  const { data: weeklyStats } = useQuery({
    queryKey: ["ai", "weekly-summary"],
    queryFn: getWeeklySummary,
    enabled,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
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
    <div className="relative min-h-dvh bg-background">
      <Orbs />
      <Navbar name={user.name} onLogout={logout} />

      <main
        className="relative z-1 mx-auto max-w-[1480px] px-8 pb-20 max-sm:px-4"
      >
        {isLoading && <LoadingState />}
        {error && <ErrorState />}
        {!isLoading && !error && data && (
          <>
            <SafeToSpendHero safeToSpend={data.safe_to_spend} />

            <div className="mb-5">
              <QuickStats dashboard={data} weeklyStats={weeklyStats?.stats ?? null} />
            </div>

            <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[1fr_340px]">
              <div className="flex flex-col gap-5">
                <WeeklySpendChart checkins={checkins ?? []} weeklyStats={weeklyStats?.stats ?? null} />

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <SavingsGoalsCard goals={data.goal_projections} />
                  <BudgetHealthCard
                    budgetHealth={data.budget_health}
                    monthlyIncome={data.monthly_income}
                    monthlyExpenses={data.monthly_expenses}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <ConfidenceCard confidence={data.confidence} />
                  <WeeklyCheckIn />
                </div>
              </div>

              <div className="xl:sticky xl:top-20">
                <AIAssistantPanel dashboard={data} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-8">
      <div className="glass h-64 animate-pulse" />
      <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
        <div className="glass-sm h-24 animate-pulse" />
        <div className="glass-sm h-24 animate-pulse" />
        <div className="glass-sm h-24 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <div className="glass h-48 animate-pulse" />
          <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1">
            <div className="glass h-72 animate-pulse" />
            <div className="glass h-72 animate-pulse" />
          </div>
        </div>
        <div className="glass min-h-[600px] animate-pulse" />
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
