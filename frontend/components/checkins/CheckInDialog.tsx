"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { createCheckIn } from "@/services/checkins";

const checkInSchema = z.object({
  amount_spent: z.number({ error: "Enter a number" }).min(0, "Cannot be negative"),
  notes: z.string().max(500, "Keep it under 500 characters").optional(),
});

type CheckInFormData = z.infer<typeof checkInSchema>;

interface CheckInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

export function CheckInDialog({ open, onOpenChange, onSaved }: CheckInDialogProps) {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CheckInFormData>({
    resolver: zodResolver(checkInSchema),
    defaultValues: { amount_spent: 0, notes: "" },
  });

  useEffect(() => {
    if (open) {
      reset({ amount_spent: 0, notes: "" });
    }
  }, [open, reset]);

  function handleOpenChange(next: boolean) {
    if (!next) setFormError(null);
    onOpenChange(next);
  }

  async function onSubmit(data: CheckInFormData) {
    setFormError(null);
    try {
      await createCheckIn({
        amount_spent: data.amount_spent,
        notes: data.notes?.trim() ? data.notes.trim() : null,
      });
      onOpenChange(false);
      onSaved?.();
    } catch {
      setFormError("Something went wrong. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Weekly check-in</DialogTitle>
          <DialogDescription>
            How did this week go? No receipts needed — a quick estimate is perfect.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {formError && (
            <div className="rounded-[12px] bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
              {formError}
            </div>
          )}

          <FormField
            label="Amount spent this week"
            htmlFor="checkin_amount"
            error={errors.amount_spent?.message}
          >
            <Input
              id="checkin_amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              {...register("amount_spent", { valueAsNumber: true })}
            />
          </FormField>

          <FormField
            label="Notes (optional)"
            htmlFor="checkin_notes"
            error={errors.notes?.message}
            hint="Anything you want to remember about this week."
          >
            <textarea
              id="checkin_notes"
              rows={3}
              placeholder="Paid off a bill, skipped a big purchase…"
              className="w-full resize-none rounded-[14px] border border-input bg-white/[0.03] px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              {...register("notes")}
            />
          </FormField>

          <DialogFooter showCloseButton={false}>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save check-in"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
