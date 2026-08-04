"use client";

import { Target } from "lucide-react";

import { MotionCard } from "@/components/dashboard/MotionCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GoalProjection } from "@/types/dashboard";

interface GoalCardProps {
  goal: GoalProjection;
  delay?: number;
}

export function GoalCard({ goal, delay = 0 }: GoalCardProps) {
  const progressPct =
    goal.target_amount > 0 ? Math.min((goal.current_amount / goal.target_amount) * 100, 100) : 0;

  return (
    <MotionCard delay={delay}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2 text-[18px]">
            <span className="flex min-w-0 items-center gap-2">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-blue-500/15 text-blue-400">
                <Target className="size-4" />
              </span>
              <span className="truncate">{goal.title}</span>
            </span>
            <Badge variant={goal.on_track ? "success" : "warning"}>
              {goal.on_track ? "On track" : "Behind"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[40px] font-semibold leading-none tracking-tight tabular-nums">
              {progressPct.toFixed(0)}%
            </span>
            <span className="text-sm text-muted-foreground">
              {formatAmount(goal.current_amount)} of {formatAmount(goal.target_amount)}
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="progress-gradient h-full rounded-full transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Time left</span>
            <span className="font-medium">
              {goal.months_to_complete <= 1 ? "Done" : `${goal.months_to_complete} months`}
            </span>
          </div>
        </CardContent>
      </Card>
    </MotionCard>
  );
}

function formatAmount(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
