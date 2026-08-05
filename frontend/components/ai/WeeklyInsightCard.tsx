"use client";

import { Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { MotionCard } from "@/components/dashboard/MotionCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/format";
import { getWeeklySummary } from "@/services/ai";

export function WeeklyInsightCard({ delay = 0 }: { delay?: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ["ai", "weekly-summary"],
    queryFn: getWeeklySummary,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const stats = data?.stats;

  return (
    <MotionCard delay={delay}>
      <Card className="flex h-full flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[18px]">
            <span className="flex size-8 items-center justify-center rounded-[10px] bg-indigo-500/15 text-indigo-400">
              <Sparkles className="size-4" />
            </span>
            Weekly insight
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded-full bg-white/[0.05]" />
              <div className="h-3 w-4/5 animate-pulse rounded-full bg-white/[0.05]" />
              <div className="h-3 w-3/5 animate-pulse rounded-full bg-white/[0.05]" />
            </div>
          ) : data?.summary ? (
            <p className="flex-1 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {data.summary}
            </p>
          ) : (
            <p className="flex-1 text-sm text-muted-foreground">
              Check in once a week and Nori will summarise how your week went against your plan.
            </p>
          )}

          {stats && (
            <div className="flex items-center justify-between rounded-[14px] bg-white/[0.04] px-3 py-2 text-sm">
              <span className="text-muted-foreground">Spent this week</span>
              <span className="flex items-center gap-2">
                <span className="font-semibold tabular-nums">
                  {formatMoney(stats.total_spent)}
                </span>
                <Badge
                  variant={stats.over_budget ? "warning" : "success"}
                  className="px-1.5 py-0 text-xs"
                >
                  {stats.checkins === 0 ? "No check-in" : stats.over_budget ? "Over" : "On plan"}
                </Badge>
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </MotionCard>
  );
}
