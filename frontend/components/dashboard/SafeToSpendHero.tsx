"use client";

import { useEffect, useState } from "react";

import { formatMoney, formatMoneyParts } from "@/lib/format";
import type { SafeToSpend } from "@/types/dashboard";

function resetsInLabel(): string {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diffMs = midnight.getTime() - now.getTime();
  const totalMinutes = Math.max(1, Math.round(diffMs / 60_000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours} hour${hours === 1 ? "" : "s"} ${minutes} min${minutes === 1 ? "" : "s"}`;
}

export function SafeToSpendHero({ safeToSpend }: { safeToSpend: SafeToSpend }) {
  const [animIn, setAnimIn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimIn(true), 100);
    return () => clearTimeout(t);
  }, []);

  const { whole, frac } = formatMoneyParts(safeToSpend.daily);

  return (
    <div
      className="pb-4 pt-[140px] text-center"
      style={{
        opacity: animIn ? 1 : 0,
        transform: animIn ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      <div
        className="mb-7 inline-flex items-center gap-1.5 rounded-[100px] px-3.5 py-1.5"
        style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}
      >
        <span className="pulse-dot size-1.75 rounded-full" style={{ background: "#34d399" }} />
        <span className="text-[12px] font-medium tracking-wide" style={{ color: "#34d399", letterSpacing: "0.04em" }}>
          LIVE BALANCE
        </span>
      </div>

      <div className="mb-2">
        <span
          className="text-[13px] font-normal uppercase"
          style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}
        >
          Safe to Spend Today
        </span>
      </div>

      <div className="mb-4 flex items-start justify-center gap-1">
        <span
          className="mt-5 text-2xl font-light"
          style={{ color: "rgba(52,211,153,0.7)" }}
        >
          ₹
        </span>
        <span className="font-display-num text-gradient-green text-[96px] font-bold leading-none">
          {whole}
        </span>
        <span
          className="mt-3.5 text-3xl font-light"
          style={{ color: "rgba(52,211,153,0.7)" }}
        >
          .{frac}
        </span>
      </div>

      <p className="m-0 text-[14px] text-white/38">
        Resets in <span className="text-white/60">{resetsInLabel()}</span> · This week{" "}
        <span className="text-white/60">{formatMoney(safeToSpend.weekly)}</span>
      </p>
    </div>
  );
}
