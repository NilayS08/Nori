"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { formatMoney } from "@/lib/format";
import { getWeeklySummary } from "@/services/ai";
import type { DashboardData } from "@/types/dashboard";
import type { WeeklySummaryResponse } from "@/types/ai";

export interface NoriMessage {
  role: "user" | "nori";
  text: string;
}

export const NORI_SUGGESTIONS = [
  "Am I overspending?",
  "What's my savings rate?",
  "Can I afford this?",
  "Review my goals",
];

function buildIntro(dashboard: DashboardData): string {
  const { monthly_income, monthly_expenses, budget_health, confidence } = dashboard;
  const rate = Math.round(budget_health.savings_ratio * 100);
  return `You earn ${formatMoney(monthly_income)} a month, spend ${formatMoney(
    monthly_expenses,
  )}, and save ${rate}% of your income. Your financial confidence is ${Math.round(
    confidence.overall,
  )}/100. Ask me anything about your money.`;
}

function buildOverspendingAnswer(
  dashboard: DashboardData,
  weekly?: WeeklySummaryResponse | null,
): string {
  const stats = weekly?.stats;
  if (stats && stats.checkins > 0 && stats.weekly_budget > 0) {
    const base = `You've spent ${formatMoney(stats.total_spent)} of your ${formatMoney(
      stats.weekly_budget,
    )} weekly budget (${Math.round(stats.vs_budget_pct)}%).`;
    return stats.over_budget
      ? `${base} You're slightly over — easing up on discretionary spending for the rest of the week will bring you back in line.`
      : `${base} You're on track to stay under budget this week.`;
  }
  const expenseRatio = Math.round(dashboard.budget_health.expense_ratio * 100);
  return `Your monthly expenses come to ${expenseRatio}% of your income — Nori rates your budget "${dashboard.budget_health.label.toLowerCase()}".`;
}

function buildSavingsAnswer(dashboard: DashboardData): string {
  const { budget_health } = dashboard;
  return `Your savings rate is ${Math.round(
    budget_health.savings_ratio * 100,
  )}% of your monthly income, with expenses at ${Math.round(
    budget_health.expense_ratio * 100,
  )}%. Keep that up and your goals will stay on track.`;
}

function buildGoalsAnswer(dashboard: DashboardData): string {
  const goals = dashboard.goal_projections;
  if (goals.length === 0) {
    return "You don't have any goals yet. Create one and Nori will track your progress towards it.";
  }
  const nearest = [...goals].sort((a, b) => a.months_to_complete - b.months_to_complete)[0];
  const remaining = Math.max(0, nearest.target_amount - nearest.current_amount);
  const onTrack = goals.filter((g) => g.on_track).length;
  return `You have ${goals.length} active goal${goals.length === 1 ? "" : "s"} (${onTrack} on track). ${
    nearest.title
  } is closest — ${formatMoney(remaining)} to go, roughly ${Math.round(
    nearest.months_to_complete,
  )} months out.`;
}

const FALLBACK =
  "I can help with questions like “Am I overspending?”, “What's my savings rate?”, “Can I afford this?”, or “Review my goals”.";

export function useNoriChat(dashboard: DashboardData) {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<NoriMessage[]>(() => [
    { role: "nori", text: buildIntro(dashboard) },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [whatIfOpen, setWhatIfOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);

  const { data: weekly } = useQuery({
    queryKey: ["ai", "weekly-summary"],
    queryFn: getWeeklySummary,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  function respond(text: string, openPurchase = false) {
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { role: "nori", text }]);
      if (openPurchase) setPurchaseOpen(true);
    }, 700);
  }

  function handleSend(raw?: string) {
    const msg = (raw ?? input).trim();
    if (!msg) return;
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setInput("");

    let reply: string;
    let openPurchase = false;

    if (/overspend|over budget|over-budget|\bbudget\b/i.test(msg)) {
      reply = buildOverspendingAnswer(dashboard, weekly);
    } else if (/savings?\s?rate|saving|save\b/i.test(msg)) {
      reply = buildSavingsAnswer(dashboard);
    } else if (/goal/i.test(msg)) {
      reply = buildGoalsAnswer(dashboard);
    } else if (/afford|buy|purchase|should i/i.test(msg)) {
      reply = "Let's check that against your plan. How much is it?";
      openPurchase = true;
    } else {
      reply = FALLBACK;
    }

    respond(reply, openPurchase);
  }

  function handleSaved() {
    void queryClient.invalidateQueries({ queryKey: ["checkins"] });
    void queryClient.invalidateQueries({ queryKey: ["ai", "weekly-summary"] });
    void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  }

  const insightText = weekly?.summary
    ? weekly.summary
    : weekly?.stats && weekly.stats.checkins > 0
      ? `You've spent ${formatMoney(weekly.stats.total_spent)} this week${
          weekly.stats.weekly_budget > 0
            ? ` — ${Math.round(weekly.stats.vs_budget_pct)}% of your weekly budget`
            : ""
        }.`
      : "Check in weekly and Nori will start spotting trends in your spending.";

  return {
    messages,
    input,
    setInput,
    typing,
    handleSend,
    suggestions: NORI_SUGGESTIONS,
    insightText,
    purchaseOpen,
    setPurchaseOpen,
    whatIfOpen,
    setWhatIfOpen,
    checkInOpen,
    setCheckInOpen,
    handleSaved,
  };
}
