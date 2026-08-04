"use client";

import { CalendarClock, Pencil, Target, Trash2 } from "lucide-react";
import Link from "next/link";

import { MotionCard } from "@/components/dashboard/MotionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/format";
import type { Goal } from "@/types/goals";

interface GoalCardProps {
  goal: Goal;
  delay?: number;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goal: Goal) => void;
}

export function GoalCard({ goal, delay = 0, onEdit, onDelete }: GoalCardProps) {
  const completed = goal.current_amount >= goal.target_amount;
  const pct = Math.min(goal.progress_pct, 100);

  return (
    <MotionCard delay={delay}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2 text-[18px]">
            <span className="flex min-w-0 items-center gap-2">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-blue-500/15 text-blue-400">
                <Target className="size-4" />
              </span>
              <Link href={`/goals/${goal.id}`} className="truncate hover:text-primary">
                {goal.title}
              </Link>
            </span>
            <Badge variant={completed ? "success" : goal.on_track ? "success" : "warning"}>
              {completed ? "Completed" : goal.on_track ? "On track" : "Behind"}
            </Badge>
          </CardTitle>
          <CardAction>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Edit goal"
                onClick={() => onEdit?.(goal)}
              >
                <Pencil className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Delete goal"
                onClick={() => onDelete?.(goal)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </CardAction>
        </CardHeader>

        <Link href={`/goals/${goal.id}`} className="group/card-link">
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-[40px] font-semibold leading-none tracking-tight tabular-nums">
                {pct.toFixed(0)}%
              </span>
              <span className="text-sm text-muted-foreground">
                {formatMoney(goal.current_amount)} of {formatMoney(goal.target_amount)}
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="progress-gradient h-full rounded-full transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <CalendarClock className="size-3.5" />
                {goal.months_until_deadline <= 1
                  ? "This month"
                  : `${goal.months_until_deadline} months left`}
              </span>
              <span className="font-medium">
                {goal.monthly_contribution > 0
                  ? `${formatMoney(goal.monthly_contribution)}/mo`
                  : "Goal met"}
              </span>
            </div>
          </CardContent>
        </Link>
      </Card>
    </MotionCard>
  );
}
