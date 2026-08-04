"use client";

import { Gauge } from "lucide-react";

import { MotionCard } from "@/components/dashboard/MotionCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ConfidenceScore } from "@/types/dashboard";

interface ConfidenceScoreCardProps {
  confidence: ConfidenceScore;
  delay?: number;
}

export function ConfidenceScoreCard({ confidence, delay = 0 }: ConfidenceScoreCardProps) {
  return (
    <MotionCard delay={delay}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[18px]">
            <span className="flex size-8 items-center justify-center rounded-[10px] bg-blue-500/15 text-blue-400">
              <Gauge className="size-4" />
            </span>
            Confidence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Overall</span>
            <span className="text-2xl font-semibold tabular-nums">{confidence.overall}</span>
          </div>
          <div className="space-y-2.5">
            <Breakdown label="Savings rate" value={confidence.savings_rate} />
            <Breakdown label="Emergency fund" value={confidence.emergency_fund_score} />
            <Breakdown label="Goal progress" value={confidence.goal_progress_score} />
          </div>
        </CardContent>
      </Card>
    </MotionCard>
  );
}

function Breakdown({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="progress-gradient h-full rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(value, 100)}%` }}
          />
        </div>
        <span className="w-8 text-right tabular-nums">{value.toFixed(0)}</span>
      </div>
    </div>
  );
}
