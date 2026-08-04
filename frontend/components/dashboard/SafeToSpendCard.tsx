"use client";

import { Wallet } from "lucide-react";

import { CountUp } from "@/components/CountUp";
import { MotionCard } from "@/components/dashboard/MotionCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SafeToSpend } from "@/types/dashboard";

interface SafeToSpendCardProps {
  safeToSpend: SafeToSpend;
  delay?: number;
}

export function SafeToSpendCard({ safeToSpend, delay = 0 }: SafeToSpendCardProps) {
  return (
    <MotionCard delay={delay}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[18px]">
            <span className="flex size-8 items-center justify-center rounded-[10px] bg-indigo-500/15 text-indigo-400">
              <Wallet className="size-4" />
            </span>
            Safe To Spend
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Breakdown label="Monthly" value={safeToSpend.monthly} />
          <Breakdown label="Weekly" value={safeToSpend.weekly} primary />
          <Breakdown label="Daily" value={safeToSpend.daily} />
        </CardContent>
      </Card>
    </MotionCard>
  );
}

function Breakdown({ label, value, primary }: { label: string; value: number; primary?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <CountUp
        value={value}
        className={
          primary
            ? "text-xl font-semibold tabular-nums text-primary"
            : "text-lg font-medium tabular-nums"
        }
      />
    </div>
  );
}
