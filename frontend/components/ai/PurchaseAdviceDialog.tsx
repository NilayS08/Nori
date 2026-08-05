"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, RotateCcw, TriangleAlert, WandSparkles } from "lucide-react";
import { useState } from "react";
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
import { formatMoney } from "@/lib/format";
import { getPurchaseAdvice } from "@/services/ai";
import type { PurchaseAdviceResponse } from "@/types/ai";

const purchaseSchema = z.object({
  amount: z.number({ error: "Enter a number" }).positive("Enter an amount greater than 0"),
  description: z.string().max(500, "Keep it under 500 characters").optional(),
});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

interface PurchaseAdviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PurchaseAdviceDialog({ open, onOpenChange }: PurchaseAdviceDialogProps) {
  const [result, setResult] = useState<PurchaseAdviceResponse | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: { amount: 0, description: "" },
  });

  function handleOpenChange(next: boolean) {
    if (!next) {
      setResult(null);
      setFormError(null);
    }
    onOpenChange(next);
  }

  function resetForm() {
    setResult(null);
    setFormError(null);
    reset({ amount: 0, description: "" });
  }

  async function onSubmit(data: PurchaseFormData) {
    setFormError(null);
    try {
      const response = await getPurchaseAdvice({
        amount: data.amount,
        description: data.description?.trim() ? data.description.trim() : null,
      });
      setResult(response);
    } catch {
      setFormError("Something went wrong. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Should I buy this?</DialogTitle>
          <DialogDescription>
            Nori checks the amount against your budget and goals — then explains the tradeoffs.
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <ResultView
            result={result}
            onReset={resetForm}
            onClose={() => handleOpenChange(false)}
          />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {formError && (
              <div className="rounded-[12px] bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
                {formError}
              </div>
            )}

            <FormField
              label="Purchase amount"
              htmlFor="purchase_amount"
              error={errors.amount?.message}
            >
              <Input
                id="purchase_amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                {...register("amount", { valueAsNumber: true })}
              />
            </FormField>

            <FormField
              label="What is it? (optional)"
              htmlFor="purchase_description"
              error={errors.description?.message}
            >
              <Input
                id="purchase_description"
                placeholder="e.g. new running shoes"
                {...register("description")}
              />
            </FormField>

            <DialogFooter showCloseButton={false}>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <WandSparkles className="size-3.5" />
                {isSubmitting ? "Asking Nori…" : "Get advice"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ResultView({
  result,
  onReset,
  onClose,
}: {
  result: PurchaseAdviceResponse;
  onReset: () => void;
  onClose: () => void;
}) {
  const { within_weekly_budget, remaining_after_purchase } = result.context.purchase;
  const budget = result.context.safe_to_spend.weekly;

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`flex items-center gap-3 rounded-[16px] p-4 ${
          within_weekly_budget
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-amber-500/10 text-amber-400"
        }`}
      >
        {within_weekly_budget ? (
          <CheckCircle2 className="size-5 shrink-0" />
        ) : (
          <TriangleAlert className="size-5 shrink-0" />
        )}
        <div className="text-sm">
          {within_weekly_budget ? (
            <p>
              Fits within your weekly budget of {formatMoney(budget)} —{" "}
              {formatMoney(Math.max(remaining_after_purchase, 0))} to spare this week.
            </p>
          ) : (
            <p>
              This would exceed your {formatMoney(budget)} weekly budget and dip into savings.
            </p>
          )}
        </div>
      </div>

      {result.advice ? (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {result.advice}
        </p>
      ) : (
        <p className="text-sm leading-relaxed text-muted-foreground">
          Nori is taking a quick pause right now. The numbers above are based on your plan —
          check back in a moment for the friendly explanation.
        </p>
      )}

      <DialogFooter showCloseButton={false}>
        <Button type="button" variant="outline" onClick={onReset}>
          <RotateCcw className="size-3.5" />
          Ask about another
        </Button>
        <Button type="button" onClick={onClose}>
          Done
        </Button>
      </DialogFooter>
    </div>
  );
}
