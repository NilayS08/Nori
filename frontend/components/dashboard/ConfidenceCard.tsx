"use client";

import type { ConfidenceScore } from "@/types/dashboard";

function confidenceLabel(score: number): string {
  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  if (score >= 40) return "fair";
  return "needs attention";
}

interface ConfidenceCardProps {
  confidence: ConfidenceScore;
}

export function ConfidenceCard({ confidence }: ConfidenceCardProps) {
  const score = Math.round(confidence.overall);
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;

  const tags = [
    { label: `Savings rate ${Math.round(confidence.savings_rate)}%`, value: confidence.savings_rate },
    { label: `Emergency fund ${Math.round(confidence.emergency_fund_score)}%`, value: confidence.emergency_fund_score },
    { label: `Goal progress ${Math.round(confidence.goal_progress_score)}%`, value: confidence.goal_progress_score },
  ];

  const weak = tags.some((t) => t.value < 40);

  return (
    <div className="glass animate-fade-in-up p-7" style={{ animationDelay: "0.22s" }}>
      <h3 className="m-0 mb-5 text-[16px] font-semibold text-foreground">Financial Confidence</h3>
      <div className="flex items-center gap-6">
        <div className="relative shrink-0">
          <svg width="120" height="120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="url(#conf-grad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{
                transformOrigin: "center",
                transform: "rotate(-90deg)",
                filter: "drop-shadow(0 0 8px rgba(129,140,248,0.5))",
              }}
            />
            <defs>
              <linearGradient id="conf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6b7cff" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span className="font-display-num text-[28px] font-bold leading-none text-foreground">
              {score}
            </span>
            <span className="mt-0.5 text-[11px] text-white/35">/ 100</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="m-0 mb-4 text-[13px] leading-relaxed text-white/50">
            Your financial habits are{" "}
            <span className="font-medium text-foreground">{confidenceLabel(score)}</span>
            {weak
              ? ". A couple of areas could use a nudge to get you to the next level."
              : ". You've built habits that keep your plan on track month after month."}
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.label}
                className="rounded-[100px] px-2.5 py-1 text-[11px] font-medium"
                style={{
                  background: "rgba(52,211,153,0.1)",
                  color: "#34d399",
                  border: "1px solid rgba(52,211,153,0.2)",
                }}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
