"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteGoal } from "@/services/goals";
import type { Goal } from "@/types/goals";

interface DeleteGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: Goal | null;
  onDeleted?: () => void;
}

export function DeleteGoalDialog({
  open,
  onOpenChange,
  goal,
  onDeleted,
}: DeleteGoalDialogProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!goal) return;
    setError(null);
    setDeleting(true);
    try {
      await deleteGoal(goal.id);
      onOpenChange(false);
      onDeleted?.();
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete this goal?</DialogTitle>
          <DialogDescription>
            This will permanently remove “{goal?.title}” and its progress.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-[12px] bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
            {error}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deleting || !goal}
            onClick={handleDelete}
          >
            {deleting ? "Deleting…" : "Delete goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
