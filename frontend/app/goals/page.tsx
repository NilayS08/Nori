"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Navbar } from "@/components/dashboard/Navbar";
import { DeleteGoalDialog } from "@/components/goals/DeleteGoalDialog";
import { GoalCard } from "@/components/goals/GoalCard";
import { GoalFormDialog } from "@/components/goals/GoalFormDialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getGoals } from "@/services/goals";
import type { Goal } from "@/types/goals";

export default function GoalsPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();

  const [formOpen, setFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null);

  const { data: goals, isLoading, error, refetch } = useQuery({
    queryKey: ["goals"],
    queryFn: getGoals,
    enabled: !!user && user.is_onboarded,
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

  function openCreate() {
    setEditingGoal(null);
    setFormOpen(true);
  }

  function openEdit(goal: Goal) {
    setEditingGoal(goal);
    setFormOpen(true);
  }

  return (
    <div className="ambient min-h-dvh bg-background">
      <Navbar name={user.name} onLogout={logout} />

      <main className="mx-auto max-w-5xl space-y-8 px-4 pt-28 pb-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[32px] font-semibold tracking-tight">Goals</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track the things you&apos;re saving for.
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            New goal
          </Button>
        </div>

        {isLoading && <LoadingState />}
        {error && <ErrorState />}
        {!isLoading && !error && goals && goals.length === 0 && (
          <EmptyState onCreate={openCreate} />
        )}
        {!isLoading && !error && goals && goals.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {goals.map((goal, i) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                delay={0.05 + i * 0.05}
                onEdit={openEdit}
                onDelete={setDeletingGoal}
              />
            ))}
          </motion.div>
        )}
      </main>

      <GoalFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        goal={editingGoal}
        onSaved={() => refetch()}
      />

      <DeleteGoalDialog
        open={!!deletingGoal}
        onOpenChange={(open) => {
          if (!open) setDeletingGoal(null);
        }}
        goal={deletingGoal}
        onDeleted={() => refetch()}
      />
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div className="glass h-52 animate-pulse rounded-[20px]" />
      <div className="glass h-52 animate-pulse rounded-[20px]" />
      <div className="glass h-52 animate-pulse rounded-[20px]" />
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <p className="text-muted-foreground">Unable to load your goals.</p>
      <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
        Retry
      </Button>
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="glass flex flex-col items-center gap-3 rounded-[24px] p-10 text-center shadow-soft">
      <p className="text-lg font-medium">No goals yet</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Create a goal to start tracking progress toward the things that matter to you.
      </p>
      <Button onClick={onCreate} className="mt-2">
        <Plus className="size-4" />
        Create your first goal
      </Button>
    </div>
  );
}
