"use client";

import { Sparkles } from "lucide-react";

import { CountUp } from "@/components/CountUp";
import { Badge } from "@/components/ui/badge";
import { greeting } from "@/lib/format";
import type { ConfidenceScore, SafeToSpend } from "@/types/dashboard";

function confidenceLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs attention";
}

function confidenceVariant(score: number): "default" | "secondary" | "outline" | "warning" {
  if (score >= 80) return "default";
  if (score >= 60) return "secondary";
  if (score >= 40) return "outline";
  return "warning";
}

interface HeroCardProps {
  safeToSpend: SafeToSpend;
  confidence: ConfidenceScore;
  userName?: string;
}

export function HeroCard({ safeToSpend, confidence, userName }: HeroCardProps) {
  return (
    <section className="glass relative overflow-hidden rounded-[24px] p-8 shadow-soft sm:p-10">
      <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative space-y-6">
        <p className="text-[15px] text-muted-foreground">
          {greeting(userName)}
        </p>

        <div className="space-y-1">
          <p className="text-[15px] text-muted-foreground">You can safely spend</p>
          <CountUp
            value={safeToSpend.weekly}
            className="block text-[64px] font-semibold leading-none tracking-tight tabular-nums"
          />
          <p className="text-[15px] text-muted-foreground">
            this week{" "}
            <span className="text-foreground/80">
              ≈ {formatDaily(safeToSpend.daily)}/day
            </span>{" "}
            without affecting your goals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Sparkles className="size-4 text-indigo-400" />
          <span className="text-sm text-muted-foreground">Financial confidence</span>
          <Badge variant={confidenceVariant(confidence.overall)}>
            {confidence.overall} · {confidenceLabel(confidence.overall)}
          </Badge>
        </div>
      </div>
    </section>
  );
}

function formatDaily(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
