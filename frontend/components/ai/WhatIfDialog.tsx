"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, RotateCcw, WandSparkles } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/format";
import { getWhatIf } from "@/services/ai";
import type { WhatIfResponse, WhatIfScenarioType } from "@/types/ai";

const whatIfSchema = z.object({
  amount: z.number({ error: "Enter a number" }).positive("Enter an amount greater than 0"),
  description: z.string().max(500, "Keep it under 500 characters").optional(),
});

type WhatIfFormData = z.infer<typeof whatIfSchema>;

const SCENARIOS: Array<{ type: WhatIfScenarioType; label: string; hint: string }> = [
  { type: "increase_income", label: "Earn more", hint: "Extra income each month" },
  { type: "increase_expenses", label: "Spend more", hint: "Higher monthly expenses" },
  { type: "one_time_purchase", label: "Buy once", hint: "Spend from savings now" },
  { type: "one_time_gain", label: "Get cash", hint: "A one-time gain" },
];

interface WhatIfDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WhatIfDialog({ open, onOpenChange }: WhatIfDialogProps) {
  const [scenario, setScenario] = useState<WhatIfScenarioType>("increase_income");
  const [result, setResult] = useState<WhatIfResponse | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WhatIfFormData>({
    resolver: zodResolver(whatIfSchema),
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

  async function onSubmit(data: WhatIfFormData) {
    setFormError(null);
    try {
      const response = await getWhatIf({
        scenario_type: scenario,
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
          <DialogTitle>What if…</DialogTitle>
          <DialogDescription>
            Pick a scenario, and Nori simulates it against your real numbers.
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <ResultView result={result} onReset={resetForm} onClose={() => handleOpenChange(false)} />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {formError && (
              <div className="rounded-[12px] bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
                {formError}
              </div>
            )}

            <div>
              <p className="mb-1.5 text-sm font-medium text-foreground">Scenario</p>
              <div className="grid grid-cols-2 gap-2">
                {SCENARIOS.map((s) => (
                  <button
                    key={s.type}
                    type="button"
                    onClick={() => setScenario(s.type)}
                    className={cn(
                      "rounded-[14px] border px-3 py-2 text-left transition-colors",
                      scenario === s.type
                        ? "border-indigo-500/40 bg-indigo-500/15 text-foreground"
                        : "border-white/[0.06] bg-white/[0.03] text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className="block text-sm font-medium">{s.label}</span>
                    <span className="block text-xs opacity-80">{s.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <FormField label="Amount" htmlFor="whatif_amount" error={errors.amount?.message}>
              <Input
                id="whatif_amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                {...register("amount", { valueAsNumber: true })}
              />
            </FormField>

            <FormField
              label="Notes (optional)"
              htmlFor="whatif_description"
              error={errors.description?.message}
            >
              <Input
                id="whatif_description"
                placeholder="e.g. a side project"
                {...register("description")}
              />
            </FormField>

            <DialogFooter showCloseButton={false}>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <WandSparkles className="size-3.5" />
                {isSubmitting ? "Simulating…" : "Run the numbers"}
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
  result: WhatIfResponse;
  onReset: () => void;
  onClose: () => void;
}) {
  const { baseline, simulation, diff } = result;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{result.description}</p>

      <div className="space-y-2 rounded-[16px] bg-white/[0.04] p-4">
        <CompareRow
          label="Weekly safe to spend"
          baseline={formatMoney(baseline.safe_to_spend.weekly)}
          simulated={formatMoney(simulation.safe_to_spend.weekly)}
          change={diff.safe_to_spend_weekly.change}
          money
        />
        <CompareRow
          label="Emergency fund"
          baseline={`${baseline.emergency_fund.progress_pct.toFixed(0)}%`}
          simulated={`${simulation.emergency_fund.progress_pct.toFixed(0)}%`}
          change={diff.emergency_fund_progress_pct.change}
        />
        <CompareRow
          label="Confidence score"
          baseline={baseline.confidence_score.toFixed(1)}
          simulated={simulation.confidence_score.toFixed(1)}
          change={diff.confidence_score.change}
        />
        {baseline.goals.length > 0 && (
          <CompareRow
            label="Goals on track"
            baseline={`${diff.goals_on_track.baseline}/${baseline.goals.length}`}
            simulated={`${diff.goals_on_track.simulated}/${simulation.goals.length}`}
            change={diff.goals_on_track.simulated - diff.goals_on_track.baseline}
          />
        )}
      </div>

      {result.recommendation ? (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {result.recommendation}
        </p>
      ) : (
        <p className="text-sm leading-relaxed text-muted-foreground">
          Nori is taking a quick pause right now. The simulation above is based on your real
          numbers — check back in a moment for the recommendation.
        </p>
      )}

      <DialogFooter showCloseButton={false}>
        <Button type="button" variant="outline" onClick={onReset}>
          <RotateCcw className="size-3.5" />
          Try another
        </Button>
        <Button type="button" onClick={onClose}>
          Done
        </Button>
      </DialogFooter>
    </div>
  );
}

function CompareRow({
  label,
  baseline,
  simulated,
  change,
  money = false,
}: {
  label: string;
  baseline: string;
  simulated: string;
  change: number;
  money?: boolean;
}) {
  const positive = change > 0;
  const negative = change < 0;
  const changeText = money ? formatMoney(Math.abs(change)) : `${Math.abs(change).toFixed(1)}`;

  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2 tabular-nums">
        <span className="text-muted-foreground line-through">{baseline}</span>
        <ArrowRight className="size-3 text-muted-foreground/60" />
        <span className="font-semibold text-foreground">{simulated}</span>
        {change !== 0 && (
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums",
              positive && "bg-emerald-500/15 text-emerald-400",
              negative && "bg-rose-500/15 text-rose-400",
            )}
          >
            {positive ? "+" : "−"}
            {changeText}
          </span>
        )}
      </span>
    </div>
  );
}
