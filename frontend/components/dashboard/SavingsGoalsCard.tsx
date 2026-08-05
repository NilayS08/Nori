"use client";

import Link from "next/link";

import { formatMoney } from "@/lib/format";
import type { GoalProjection } from "@/types/dashboard";

const GOAL_COLORS = [
  { color: "#818cf8", glow: "rgba(129,140,248,0.3)" },
  { color: "#34d399", glow: "rgba(52,211,153,0.3)" },
  { color: "#f59e0b", glow: "rgba(245,158,11,0.3)" },
  { color: "#a78bfa", glow: "rgba(167,139,250,0.3)" },
  { color: "#38bdf8", glow: "rgba(56,189,248,0.3)" },
];

function ProgressRing({
  pct,
  color,
  glow,
  size = 64,
}: {
  pct: number;
  color: string;
  glow: string;
  size?: number;
}) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="5"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{
          transformOrigin: "center",
          transform: "rotate(-90deg)",
          filter: `drop-shadow(0 0 6px ${glow})`,
        }}
      />
    </svg>
  );
}

export function SavingsGoalsCard({ goals }: { goals: GoalProjection[] }) {
  const active = goals.length;
  const onTrack = goals.filter((g) => g.on_track).length;

  return (
    <div className="glass animate-fade-in-up p-7" style={{ animationDelay: "0.1s" }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="m-0 text-[16px] font-semibold text-foreground">Savings Goals</h3>
          <p className="m-0 mt-0.5 text-[12px] text-white/38">
            {active} active · {onTrack} on track
          </p>
        </div>
        <Link
          href="/goals"
          className="rounded-[100px] px-3.5 py-1.5 text-[12px] font-medium text-white/50 transition-colors hover:text-foreground"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}
        >
          View all
        </Link>
      </div>

      {goals.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-3 rounded-[16px] border border-dashed border-white/10">
          <p className="text-[13px] text-white/45">No goals yet — set your first one.</p>
          <Link
            href="/goals"
            className="rounded-[100px] px-4 py-1.5 text-[12px] font-medium text-foreground"
            style={{ background: "rgba(107,124,255,0.2)", border: "1px solid rgba(107,124,255,0.4)" }}
          >
            Create a goal
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {goals.slice(0, 3).map((g, i) => {
            const pct = Math.min(100, Math.round((g.current_amount / Math.max(g.target_amount, 1)) * 100));
            const { color, glow } = GOAL_COLORS[i % GOAL_COLORS.length];
            return (
              <div key={g.title} className="flex items-center gap-4">
                <ProgressRing pct={pct} color={color} glow={glow} />
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <span className="text-[14px] font-medium text-foreground">{g.title}</span>
                    <span className="text-[12px] font-semibold" style={{ color }}>
                      {pct}%
                    </span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-white/7">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: color,
                        boxShadow: `0 0 8px ${glow}`,
                        transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between">
                    <span className="text-[11.5px] text-white/35">
                      {formatMoney(g.current_amount)}
                    </span>
                    <span className="text-[11.5px] text-white/25">
                      {formatMoney(g.target_amount)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
