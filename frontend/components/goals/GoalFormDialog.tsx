"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FormField } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createGoal, updateGoal } from "@/services/goals";
import type { Goal } from "@/types/goals";

const goalSchema = z.object({
  title: z.string().min(1, "Give your goal a name").max(255),
  target_amount: z
    .number({ error: "Enter a number" })
    .positive("Target must be greater than 0"),
  current_amount: z.number({ error: "Enter a number" }).min(0, "Cannot be negative"),
  deadline: z.string().min(1, "Pick a deadline"),
});

type GoalFormData = z.infer<typeof goalSchema>;

interface GoalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: Goal | null;
  onSaved?: () => void;
}

export function GoalFormDialog({
  open,
  onOpenChange,
  goal,
  onSaved,
}: GoalFormDialogProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
  });

  useEffect(() => {
    if (open) {
      reset({
        title: goal?.title ?? "",
        target_amount: goal?.target_amount ?? undefined,
        current_amount: goal?.current_amount ?? 0,
        deadline: goal?.deadline ?? "",
      });
    }
  }, [open, goal, reset]);

  function handleOpenChange(next: boolean) {
    if (!next) setFormError(null);
    onOpenChange(next);
  }

  async function onSubmit(data: GoalFormData) {
    setFormError(null);
    if (data.deadline < new Date().toISOString().slice(0, 10)) {
      setFormError("Pick a date in the future");
      return;
    }
    try {
      if (goal) {
        await updateGoal(goal.id, {
          title: data.title,
          target_amount: data.target_amount,
          current_amount: data.current_amount,
          deadline: data.deadline,
        });
      } else {
        await createGoal({
          title: data.title,
          target_amount: data.target_amount,
          current_amount: data.current_amount,
          deadline: data.deadline,
        });
      }
      onOpenChange(false);
      onSaved?.();
      router.refresh();
    } catch {
      setFormError("Something went wrong. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{goal ? "Edit goal" : "New goal"}</DialogTitle>
          <DialogDescription>
            {goal
              ? "Update the details of your goal."
              : "What are you saving toward?"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {formError && (
            <div className="rounded-[12px] bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
              {formError}
            </div>
          )}

          <FormField label="Goal name" htmlFor="goal_title" error={errors.title?.message}>
            <Input
              id="goal_title"
              placeholder="Emergency fund, trip, laptop…"
              {...register("title")}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Target"
              htmlFor="goal_target"
              error={errors.target_amount?.message}
            >
              <Input
                id="goal_target"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                {...register("target_amount", { valueAsNumber: true })}
              />
            </FormField>
            <FormField
              label="Saved so far"
              htmlFor="goal_current"
              error={errors.current_amount?.message}
            >
              <Input
                id="goal_current"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                {...register("current_amount", { valueAsNumber: true })}
              />
            </FormField>
          </div>

          <FormField label="Target date" htmlFor="goal_deadline" error={errors.deadline?.message}>
            <Input
              id="goal_deadline"
              type="date"
              className="[color-scheme:dark]"
              {...register("deadline")}
            />
          </FormField>

          <DialogFooter showCloseButton={false}>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving…"
                : goal
                  ? "Save changes"
                  : "Create goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
