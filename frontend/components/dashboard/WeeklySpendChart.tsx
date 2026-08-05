"use client";

import { Sparkles } from "lucide-react";

import { formatMoney } from "@/lib/format";
import type { WeeklySummaryStats } from "@/types/ai";
import type { CheckIn } from "@/types/checkins";

interface WeeklySpendChartProps {
  checkins: CheckIn[];
  weeklyStats?: WeeklySummaryStats | null;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeeklySpendChart({ checkins, weeklyStats }: WeeklySpendChartProps) {
  const total = weeklyStats?.total_spent ?? 0;
  const budget = weeklyStats?.weekly_budget ?? 0;
  const over = (weeklyStats?.over_budget ?? false) && (weeklyStats?.checkins ?? 0) > 0;

  const recent = [...checkins]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .slice(-7);

  const max = Math.max(1, ...recent.map((c) => c.amount_spent));

  const insight = weeklyStats && weeklyStats.checkins > 0 && budget > 0
    ? `You spent ${formatMoney(total)} this week — ${Math.round(
        weeklyStats.vs_budget_pct,
      )}% of your ${formatMoney(budget)} weekly budget.`
    : "Nothing logged this week yet. Do your weekly check-in and Nori will track your spending here.";

  return (
    <div className="glass animate-fade-in-up p-7" style={{ animationDelay: "0.2s" }}>
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h3 className="m-0 text-[16px] font-semibold text-foreground">Weekly Spending</h3>
          <p className="m-0 mt-0.5 text-[12px] text-white/38">
            Total this week ·{" "}
            <span className="text-foreground">{formatMoney(total)}</span>
          </p>
        </div>
        <div className="flex gap-1">
          {["W", "M", "Y"].map((p) => {
            const active = p === "W";
            return (
              <button
                key={p}
                className="size-8 rounded-[8px] text-[12px] font-medium"
                style={{
                  background: active ? "rgba(107,124,255,0.2)" : "transparent",
                  color: active ? "#818cf8" : "rgba(255,255,255,0.3)",
                }}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {recent.length >= 2 ? (
        <div className="flex h-20 items-end gap-2">
          {recent.map((checkin, i) => {
            const isLatest = i === recent.length - 1;
            const date = new Date(checkin.created_at);
            return (
              <div
                key={checkin.id}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className="relative w-full overflow-hidden rounded-[6px]"
                  style={{
                    height: `${(checkin.amount_spent / max) * 72}px`,
                    background: isLatest
                      ? "linear-gradient(180deg, #818cf8 0%, #6b7cff 100%)"
                      : "rgba(255,255,255,0.07)",
                    boxShadow: isLatest ? "0 0 16px rgba(107,124,255,0.5)" : "none",
                  }}
                >
                  {isLatest && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 60%)",
                      }}
                    />
                  )}
                </div>
                <span
                  className="text-[11px]"
                  style={{
                    color: isLatest ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)",
                    fontWeight: isLatest ? 600 : 400,
                  }}
                >
                  {DAY_LABELS[date.getDay()]}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex h-24 items-center justify-center rounded-[14px] border border-dashed border-white/10">
          <p className="max-w-xs text-center text-[12.5px] text-white/35">
            Check in for at least 2 weeks and your weekly spending trend will appear here.
          </p>
        </div>
      )}

      <div
        className="mt-5 flex items-center gap-2.5 rounded-[12px] px-4 py-3.5"
        style={{
          background: "rgba(107,124,255,0.07)",
          border: "1px solid rgba(107,124,255,0.12)",
        }}
      >
        <Sparkles className="size-3.5 shrink-0" strokeWidth={1.5} style={{ color: "#818cf8" }} />
        <p className="m-0 text-[12.5px] leading-relaxed text-white/50">
          {over ? (
            <>
              You&apos;ve gone{" "}
              <span style={{ color: "#f59e0b", fontWeight: 500 }}>over budget</span> this week. A
              lighter weekend could bring you back under.
            </>
          ) : (
            insight
          )}
        </p>
      </div>
    </div>
  );
}
