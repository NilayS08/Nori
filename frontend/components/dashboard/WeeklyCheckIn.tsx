"use client";

import { CalendarCheck, CircleCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { CheckInDialog } from "@/components/checkins/CheckInDialog";
import { formatMoney } from "@/lib/format";
import { getLatestCheckIn } from "@/services/checkins";

function startOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = (result.getDay() + 6) % 7;
  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() - day);
  return result;
}

function isThisWeek(date: Date): boolean {
  const now = new Date();
  const start = startOfWeek(now);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return date >= start && date < end;
}

export function WeeklyCheckIn() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: latest, isLoading } = useQuery({
    queryKey: ["checkins", "latest"],
    queryFn: getLatestCheckIn,
  });

  const checkedIn = latest ? isThisWeek(new Date(latest.created_at)) : false;

  function handleSaved() {
    void queryClient.invalidateQueries({ queryKey: ["checkins"] });
    void queryClient.invalidateQueries({ queryKey: ["ai", "weekly-summary"] });
    void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  }

  return (
    <>
      <div className="glass animate-fade-in-up p-7" style={{ animationDelay: "0.25s" }}>
        <div className="mb-1.5 flex items-center gap-2">
          <span className="pulse-dot size-1.5 rounded-full" style={{ background: "#818cf8" }} />
          <span
            className="text-[11px] font-semibold uppercase"
            style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em" }}
          >
            Weekly Check-in
          </span>
        </div>
        <h3 className="m-0 mb-5 text-[16px] font-semibold text-foreground">
          How did your week go?
        </h3>

        {isLoading ? (
          <div className="h-14 animate-pulse rounded-[14px] bg-white/4" />
        ) : checkedIn && latest ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[13.5px] font-medium" style={{ color: "#34d399" }}>
              <CircleCheck className="size-4" />
              Checked in this week
            </div>
            <div className="flex items-baseline justify-between rounded-[14px] px-4 py-3" style={{ background: "rgba(255,255,255,0.04)" }}>
              <span className="font-display-num text-[20px] font-bold text-foreground">
                {formatMoney(latest.amount_spent)}
              </span>
              <span className="text-[12.5px] text-white/40">spent this week</span>
            </div>
            {latest.notes && (
              <p className="text-[13px] leading-relaxed text-white/50">“{latest.notes}”</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[13px] text-white/45">
              <Sparkles className="size-4" />
              A quick note about your week — no receipts needed.
            </div>
            <button
              onClick={() => setOpen(true)}
              className="flex items-center justify-center gap-2 rounded-[12px] px-4 py-2.5 text-[13.5px] font-medium text-white transition-colors"
              style={{
                background: "linear-gradient(135deg, #6b7cff 0%, #a78bfa 100%)",
                boxShadow: "0 0 14px rgba(107,124,255,0.4)",
              }}
            >
              <CalendarCheck className="size-4" />
              Do this week&apos;s check-in
            </button>
          </div>
        )}
      </div>

      <CheckInDialog open={open} onOpenChange={setOpen} onSaved={handleSaved} />
    </>
  );
}
