"use client";

import { Shield } from "lucide-react";

import { CountUp } from "@/components/CountUp";
import { MotionCard } from "@/components/dashboard/MotionCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EmergencyFund } from "@/types/dashboard";

interface EmergencyFundCardProps {
  emergencyFund: EmergencyFund;
  delay?: number;
}

export function EmergencyFundCard({ emergencyFund, delay = 0 }: EmergencyFundCardProps) {
  return (
    <MotionCard delay={delay}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[18px]">
            <span className="flex size-8 items-center justify-center rounded-[10px] bg-emerald-500/15 text-emerald-400">
              <Shield className="size-4" />
            </span>
            Emergency Fund
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-lg font-semibold tabular-nums">
                {emergencyFund.progress_pct.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="progress-gradient h-full rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(emergencyFund.progress_pct, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Saved</span>
            <CountUp value={emergencyFund.current_amount} className="text-sm font-medium tabular-nums" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Target</span>
            <CountUp value={emergencyFund.target_amount} className="text-sm font-medium tabular-nums" />
          </div>

          {!emergencyFund.is_funded && emergencyFund.monthly_contribution_needed > 0 && (
            <div className="rounded-[12px] bg-white/[0.03] px-3 py-2.5 text-sm text-muted-foreground">
              {emergencyFund.months_to_fund <= 1 ? "Almost there —" : `${emergencyFund.months_to_fund} months left`}{" "}
              at <span className="font-medium text-foreground">{formatAmount(emergencyFund.monthly_contribution_needed)}</span>/mo
            </div>
          )}

          {emergencyFund.is_funded && (
            <div className="rounded-[12px] bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-400">
              Fully funded. You&apos;re protected.
            </div>
          )}
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
