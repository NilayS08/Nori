"use client";

import { CreditCard, PiggyBank } from "lucide-react";

import { formatMoney } from "@/lib/format";
import type { BudgetHealth } from "@/types/dashboard";

interface BudgetHealthCardProps {
  budgetHealth: BudgetHealth;
  monthlyIncome: number;
  monthlyExpenses: number;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function daysRemaining(): number {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return lastDay - now.getDate();
}

export function BudgetHealthCard({
  budgetHealth,
  monthlyIncome,
  monthlyExpenses,
}: BudgetHealthCardProps) {
  const now = new Date();
  const monthLabel = `${MONTHS[now.getMonth()]} · ${daysRemaining()} days remaining`;
  const score = Math.min(100, Math.round(budgetHealth.score));
  const healthy = score >= 60;

  const rows = [
    {
      name: "Monthly expenses",
      icon: CreditCard,
      amount: formatMoney(monthlyExpenses),
      pct: Math.round(budgetHealth.expense_ratio * 100),
      color: "#6b7cff",
      glow: "rgba(107,124,255,0.4)",
      over: budgetHealth.expense_ratio >= 0.9,
      overColor: "#f59e0b",
      overGlow: "rgba(245,158,11,0.4)",
    },
    {
      name: "Monthly savings",
      icon: PiggyBank,
      amount: formatMoney(monthlyIncome - monthlyExpenses),
      pct: Math.round(budgetHealth.savings_ratio * 100),
      color: "#34d399",
      glow: "rgba(52,211,153,0.4)",
      over: false,
      overColor: "#34d399",
      overGlow: "rgba(52,211,153,0.4)",
    },
  ];

  return (
    <div className="glass animate-fade-in-up p-7" style={{ animationDelay: "0.15s" }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="m-0 text-[16px] font-semibold text-foreground">Budget Health</h3>
          <p className="m-0 mt-0.5 text-[12px] text-white/38">{monthLabel}</p>
        </div>
        <span
          className="rounded-[100px] px-3 py-1 text-[12px] font-semibold"
          style={{
            background: healthy ? "rgba(52,211,153,0.12)" : "rgba(245,158,11,0.12)",
            color: healthy ? "#34d399" : "#f59e0b",
            border: `1px solid ${healthy ? "rgba(52,211,153,0.2)" : "rgba(245,158,11,0.2)"}`,
          }}
        >
          {budgetHealth.label}
        </span>
      </div>

      <div className="mb-5">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-[13.5px] font-medium text-foreground">Overall score</span>
          <span className="text-[13px] font-semibold" style={{ color: healthy ? "#34d399" : "#f59e0b" }}>
            {score}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/7">
          <div
            className="h-full rounded-full"
            style={{
              width: `${score}%`,
              background: healthy ? "#34d399" : "#f59e0b",
              boxShadow: healthy
                ? "0 0 6px rgba(52,211,153,0.4)"
                : "0 0 6px rgba(245,158,11,0.4)",
              transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {rows.map((row) => {
          const barColor = row.over ? row.overColor : row.color;
          const barGlow = row.over ? row.overGlow : row.glow;
          return (
            <div key={row.name}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="flex size-7 items-center justify-center rounded-[8px]"
                    style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
                  >
                    <row.icon className="size-3.5" strokeWidth={1.8} />
                  </div>
                  <span className="text-[13.5px] font-medium text-foreground">{row.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[13px] font-semibold" style={{ color: row.over ? row.overColor : "#f0f0f5" }}>
                    {row.amount}
                  </span>
                  <span className="text-[12px] text-white/30"> · {row.pct}%</span>
                </div>
              </div>
              <div className="h-[5px] overflow-hidden rounded-[5px] bg-white/7">
                <div
                  className="h-full rounded-[5px]"
                  style={{
                    width: `${row.pct}%`,
                    background: barColor,
                    boxShadow: `0 0 6px ${barGlow}`,
                    transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
