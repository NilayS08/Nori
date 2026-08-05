"use client";

import { TrendingDown, TrendingUp } from "lucide-react";

import { formatMoney } from "@/lib/format";
import type { DashboardData } from "@/types/dashboard";
import type { WeeklySummaryStats } from "@/types/ai";

interface QuickStatsProps {
  dashboard: DashboardData;
  weeklyStats?: WeeklySummaryStats | null;
}

export function QuickStats({ dashboard, weeklyStats }: QuickStatsProps) {
  const { budget_health, safe_to_spend, emergency_fund, goal_projections } = dashboard;

  const avgDaily =
    weeklyStats && weeklyStats.checkins > 0 ? weeklyStats.average_per_day : dashboard.monthly_expenses / 30;

  const withinBudget = avgDaily <= safe_to_spend.daily;

  const nearestGoal = [...goal_projections].sort(
    (a, b) => a.months_to_complete - b.months_to_complete,
  )[0];

  const stats: Array<{
    label: string;
    value: string;
    icon: "up" | "down";
    caption: string;
    iconColor: string;
    captionColor: string;
  }> = [
    {
      label: "Avg daily spend",
      value: formatMoney(avgDaily),
      icon: withinBudget ? "down" : "up",
      caption: withinBudget ? "within your daily budget" : "above your daily budget",
      iconColor: withinBudget ? "#34d399" : "#f59e0b",
      captionColor: withinBudget ? "#34d399" : "#f59e0b",
    },
    {
      label: "Savings rate",
      value: `${Math.round(budget_health.savings_ratio * 100)}%`,
      icon: "up",
      caption: `emergency fund ${Math.round(emergency_fund.progress_pct)}% funded`,
      iconColor: "#34d399",
      captionColor: "#34d399",
    },
    {
      label: "Days to goal",
      value: nearestGoal ? String(Math.max(0, Math.round(nearestGoal.months_to_complete * 30))) : "—",
      icon: "down",
      caption: nearestGoal?.title ?? "no goals yet",
      iconColor: "#818cf8",
      captionColor: nearestGoal ? "#818cf8" : "rgba(255,255,255,0.38)",
    },
  ];

  return (
    <div
      className="animate-fade-in-up grid grid-cols-3 gap-3 max-sm:grid-cols-1"
      style={{ animationDelay: "0.05s" }}
    >
      {stats.map(({ label, value, icon, caption, iconColor, captionColor }) => (
        <div key={label} className="glass-sm px-5 py-4">
          <div className="mb-2 text-[11.5px] font-medium text-white/35">{label}</div>
          <div className="flex items-baseline gap-2">
            <span className="font-display-num text-[22px] font-bold text-foreground">{value}</span>
          </div>
          <div className="mt-1 flex items-center gap-1">
            {icon === "up" ? (
              <TrendingUp className="size-3" strokeWidth={2} style={{ color: iconColor }} />
            ) : (
              <TrendingDown className="size-3" strokeWidth={2} style={{ color: iconColor }} />
            )}
            <span className="text-[11px] font-semibold" style={{ color: captionColor }}>
              {caption}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
