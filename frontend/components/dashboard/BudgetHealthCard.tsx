"use client";

import { HeartPulse } from "lucide-react";

import { MotionCard } from "@/components/dashboard/MotionCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BudgetHealth } from "@/types/dashboard";

interface BudgetHealthCardProps {
  budgetHealth: BudgetHealth;
  monthlyIncome: number;
  monthlyExpenses: number;
  delay?: number;
}

const labelVariant: Record<string, "success" | "default" | "warning" | "destructive"> = {
  Excellent: "success",
  Good: "default",
  Fair: "warning",
  Tight: "destructive",
};

export function BudgetHealthCard({
  budgetHealth,
  monthlyIncome,
  monthlyExpenses,
  delay = 0,
}: BudgetHealthCardProps) {
  return (
    <MotionCard delay={delay}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-[18px]">
            <span className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-[10px] bg-amber-500/15 text-amber-400">
                <HeartPulse className="size-4" />
              </span>
              Budget Health
            </span>
            <Badge variant={labelVariant[budgetHealth.label] ?? "default"}>
              {budgetHealth.label}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Score</span>
            <span className="text-2xl font-semibold tabular-nums">{budgetHealth.score}</span>
          </div>
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-muted-foreground">Income</span>
            <span className="font-medium tabular-nums">{formatAmount(monthlyIncome)}</span>
          </div>
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-muted-foreground">Expenses</span>
            <span className="font-medium tabular-nums">{formatAmount(monthlyExpenses)}</span>
          </div>
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-muted-foreground">Expense ratio</span>
            <span className="font-medium tabular-nums">
              {(budgetHealth.expense_ratio * 100).toFixed(1)}%
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
