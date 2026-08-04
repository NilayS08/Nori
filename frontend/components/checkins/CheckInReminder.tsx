"use client";

import { CalendarCheck, CircleCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { CheckInDialog } from "@/components/checkins/CheckInDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/format";
import { getLatestCheckIn } from "@/services/checkins";

export function CheckInReminder() {
  const [open, setOpen] = useState(false);
  const { data: latest, isLoading, refetch } = useQuery({
    queryKey: ["checkins", "latest"],
    queryFn: getLatestCheckIn,
  });

  const checkedIn = latest ? isThisWeek(new Date(latest.created_at)) : false;

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[18px]">
            <span className="flex size-8 items-center justify-center rounded-[10px] bg-emerald-500/15 text-emerald-400">
              <CalendarCheck className="size-4" />
            </span>
            Weekly check-in
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="h-10 animate-pulse rounded-[12px] bg-white/[0.04]" />
          ) : checkedIn && latest ? (
            <>
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <CircleCheck className="size-4" />
                Checked in this week
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-semibold tabular-nums">
                  {formatMoney(latest.amount_spent)}
                </span>
                <span className="text-sm text-muted-foreground">
                  spent this week
                </span>
              </div>
              {latest.notes && (
                <p className="text-sm text-muted-foreground">“{latest.notes}”</p>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="size-4" />
                A quick note about your week — no receipts needed.
              </div>
              <Button size="sm" className="w-full" onClick={() => setOpen(true)}>
                Do this week&apos;s check-in
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <CheckInDialog
        open={open}
        onOpenChange={setOpen}
        onSaved={() => refetch()}
      />
    </>
  );
}

function isThisWeek(date: Date): boolean {
  const now = new Date();
  const start = startOfWeek(now);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return date >= start && date < end;
}

function startOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = (result.getDay() + 6) % 7;
  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() - day);
  return result;
}
