"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  NoriChatHeader,
  NoriChatInput,
  NoriChatThread,
  NoriQuickActions,
  NoriSuggestions,
  NoriWeeklyInsight,
} from "@/components/ai/NoriChat";
import { CheckInDialog } from "@/components/checkins/CheckInDialog";
import { PurchaseAdviceDialog } from "@/components/ai/PurchaseAdviceDialog";
import { WhatIfDialog } from "@/components/ai/WhatIfDialog";
import { useNoriChat } from "@/components/ai/useNoriChat";
import { Navbar } from "@/components/dashboard/Navbar";
import { Orbs } from "@/components/dashboard/Orbs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getDashboard } from "@/services/dashboard";
import type { DashboardData } from "@/types/dashboard";

export default function InsightsPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();

  useEffect(() => {
    if (!authLoading && user && !user.is_onboarded) {
      router.push("/onboarding");
    }
  }, [user, authLoading, router]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    enabled: !!user && user.is_onboarded,
  });

  if (authLoading || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!user.is_onboarded) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-muted-foreground">Redirecting…</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh bg-background">
      <Orbs />
      <Navbar name={user.name} onLogout={logout} />

      <main className="relative z-1 mx-auto max-w-[1200px] px-8 pb-12 pt-28 max-sm:px-4">
        <div className="mb-6">
          <h1 className="m-0 text-[28px] font-semibold tracking-tight">Insights</h1>
          <p className="m-0 mt-1 text-sm text-muted-foreground">
            Ask Nori anything about your money.
          </p>
        </div>

        {isLoading && <LoadingState />}
        {error && <ErrorState />}
        {!isLoading && !error && data && <InsightsView dashboard={data} />}
      </main>
    </div>
  );
}

function InsightsView({ dashboard }: { dashboard: DashboardData }) {
  const router = useRouter();
  const chat = useNoriChat(dashboard);

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_300px]">
        <div
          className="glass flex h-[calc(100vh-220px)] min-h-[560px] flex-col overflow-hidden"
          style={{ padding: 0 }}
        >
          <NoriChatHeader />

          <NoriChatThread
            messages={chat.messages}
            typing={chat.typing}
            className="flex-1 overflow-y-auto px-6 py-5"
          />

          <div className="px-6 pb-3">
            <NoriSuggestions suggestions={chat.suggestions} onPick={chat.handleSend} />
          </div>

          <div className="px-4 pb-5">
            <NoriChatInput value={chat.input} onChange={chat.setInput} onSend={chat.handleSend} />
          </div>
        </div>

        <div className="space-y-5 lg:sticky lg:top-28">
          <div className="glass p-6">
            <NoriWeeklyInsight text={chat.insightText} />
          </div>

          <div className="glass p-6">
            <p className="m-0 mb-4 text-[13px] font-semibold text-foreground">Quick actions</p>
            <NoriQuickActions
              onLogSpend={() => chat.setCheckInOpen(true)}
              onWhatIf={() => chat.setWhatIfOpen(true)}
              onNewGoal={() => router.push("/goals")}
            />
          </div>
        </div>
      </div>

      <PurchaseAdviceDialog open={chat.purchaseOpen} onOpenChange={chat.setPurchaseOpen} />
      <WhatIfDialog open={chat.whatIfOpen} onOpenChange={chat.setWhatIfOpen} />
      <CheckInDialog open={chat.checkInOpen} onOpenChange={chat.setCheckInOpen} onSaved={chat.handleSaved} />
    </>
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_300px]">
      <div className="glass h-[calc(100vh-220px)] min-h-[560px] animate-pulse" />
      <div className="space-y-5">
        <div className="glass h-36 animate-pulse" />
        <div className="glass h-36 animate-pulse" />
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <p className="text-muted-foreground">Unable to load your finances.</p>
      <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
        Retry
      </Button>
    </div>
  );
}
