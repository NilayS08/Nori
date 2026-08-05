"use client";

import { Loader2, Sparkles, WandSparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney, formatPercent } from "@/lib/format";
import { getGoalExplanation } from "@/services/ai";
import type { GoalExplanationResponse } from "@/types/ai";

interface GoalInsightCardProps {
  goalId: number;
  goalTitle: string;
}

export function GoalInsightCard({ goalId, goalTitle }: GoalInsightCardProps) {
  const [result, setResult] = useState<GoalExplanationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function explain() {
    setLoading(true);
    setError(false);
    try {
      setResult(await getGoalExplanation(goalId));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[18px]">
          <span className="flex size-8 items-center justify-center rounded-[10px] bg-indigo-500/15 text-indigo-400">
            <Sparkles className="size-4" />
          </span>
          Nori&apos;s take
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!result && !loading && (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-muted-foreground">
              A plain-language read on whether {goalTitle} is on track, what the monthly
              contribution means for your everyday budget, and one next step.
            </p>
            <Button size="sm" onClick={explain} disabled={loading}>
              <WandSparkles className="size-3.5" />
              Explain this goal
            </Button>
            {error && (
              <p className="text-sm text-rose-400">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Nori is reading your goal…
          </div>
        )}

        {result && !loading && (
          <>
            <div className="flex flex-wrap gap-x-6 gap-y-2 rounded-[16px] bg-white/[0.04] px-4 py-3 text-sm">
              <span className="text-muted-foreground">
                Progress{" "}
                <span className="font-semibold text-foreground">
                  {formatPercent(result.goal.progress_pct)}
                </span>
              </span>
              <span className="text-muted-foreground">
                Saved{" "}
                <span className="font-semibold text-foreground">
                  {formatMoney(result.goal.current_amount)}
                </span>
              </span>
              {result.goal.monthly_contribution > 0 && (
                <span className="text-muted-foreground">
                  Needs{" "}
                  <span className="font-semibold text-foreground">
                    {formatMoney(result.goal.monthly_contribution)}
                  </span>{" "}
                  per month
                </span>
              )}
            </div>

            {result.explanation ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {result.explanation}
              </p>
            ) : (
              <p className="text-sm leading-relaxed text-muted-foreground">
                Nori is taking a quick pause right now. The numbers above are based on your
                plan — check back in a moment for the explanation.
              </p>
            )}

            <Button size="sm" variant="outline" onClick={explain} disabled={loading}>
              Regenerate
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
