"use client";

import { ArrowLeft, CalendarClock, Pencil, Trash2, Wallet } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Navbar } from "@/components/dashboard/Navbar";
import { GoalInsightCard } from "@/components/ai/GoalInsightCard";
import { DeleteGoalDialog } from "@/components/goals/DeleteGoalDialog";
import { GoalFormDialog } from "@/components/goals/GoalFormDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { getGoal } from "@/services/goals";
import { formatMoney, formatMoneyExact } from "@/lib/format";

export default function GoalDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const goalId = Number(id);

  const { user, loading: authLoading, logout } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: goal, isLoading, error, refetch } = useQuery({
    queryKey: ["goal", goalId],
    queryFn: () => getGoal(goalId),
    enabled: !!user && user.is_onboarded && Number.isFinite(goalId),
  });

  useEffect(() => {
    if (!authLoading && user && !user.is_onboarded) {
      router.push("/onboarding");
    }
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="ambient min-h-dvh bg-background">
      <Navbar name={user.name} onLogout={logout} />

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <Link
          href="/goals"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          All goals
        </Link>

        {isLoading && <LoadingState />}
        {error && <ErrorState />}
        {!isLoading && !error && goal && (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-[32px] font-semibold tracking-tight">
                    {goal.title}
                  </h1>
                  <Badge
                    variant={
                      goal.current_amount >= goal.target_amount
                        ? "success"
                        : goal.on_track
                          ? "success"
                          : "warning"
                    }
                  >
                    {goal.current_amount >= goal.target_amount
                      ? "Completed"
                      : goal.on_track
                        ? "On track"
                        : "Behind"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {goal.months_until_deadline <= 1
                    ? "Deadline this month"
                    : `${goal.months_until_deadline} months until deadline`}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFormOpen(true)}
                >
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-rose-400"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-[18px]">Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-[56px] font-semibold leading-none tracking-tight tabular-nums">
                    {Math.min(goal.progress_pct, 100).toFixed(0)}%
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatMoney(goal.current_amount)} of {formatMoney(goal.target_amount)}
                  </span>
                </div>

                <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="progress-gradient h-full rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(goal.progress_pct, 100)}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
                  <Stat label="Saved" value={formatMoney(goal.current_amount)} />
                  <Stat label="Target" value={formatMoney(goal.target_amount)} />
                  <Stat
                    label="Remaining"
                    value={formatMoney(Math.max(goal.remaining, 0))}
                  />
                  <Stat
                    label="Per month"
                    value={
                      goal.monthly_contribution > 0
                        ? formatMoney(goal.monthly_contribution)
                        : "—"
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[18px]">
                    <span className="flex size-8 items-center justify-center rounded-[10px] bg-indigo-500/15 text-indigo-400">
                      <CalendarClock className="size-4" />
                    </span>
                    Deadline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium">
                    {formatDeadline(goal.deadline)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {goal.months_until_deadline <= 1
                      ? "Less than a month away"
                      : `In ${goal.months_until_deadline} months`}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[18px]">
                    <span className="flex size-8 items-center justify-center rounded-[10px] bg-blue-500/15 text-blue-400">
                      <Wallet className="size-4" />
                    </span>
                    Goal pace
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium">
                    {goal.monthly_contribution > 0
                      ? `${formatMoneyExact(goal.monthly_contribution)} / month`
                      : "Goal met"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {goal.months_to_complete <= 1
                      ? "Reachable this month"
                      : `On pace to finish in ${goal.months_to_complete} months`}
                  </p>
                </CardContent>
              </Card>
            </div>

            <GoalInsightCard goalId={goal.id} goalTitle={goal.title} />
          </>
        )}
      </main>

      <GoalFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        goal={goal}
        onSaved={() => refetch()}
      />

      <DeleteGoalDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        goal={goal}
        onDeleted={() => router.push("/goals")}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] bg-white/[0.04] p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-[17px] font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function formatDeadline(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="glass h-10 w-1/3 animate-pulse rounded-[12px]" />
      <div className="glass h-64 animate-pulse rounded-[24px]" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="glass h-36 animate-pulse rounded-[20px]" />
        <div className="glass h-36 animate-pulse rounded-[20px]" />
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <p className="text-muted-foreground">Unable to load this goal.</p>
      <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
        Retry
      </Button>
    </div>
  );
}
