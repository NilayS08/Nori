"use client";

import { useRouter } from "next/navigation";

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
import type { DashboardData } from "@/types/dashboard";

interface AIAssistantPanelProps {
  dashboard: DashboardData;
}

export function AIAssistantPanel({ dashboard }: AIAssistantPanelProps) {
  const router = useRouter();
  const chat = useNoriChat(dashboard);

  return (
    <>
      <div
        className="glass flex min-h-[600px] flex-col overflow-hidden"
        style={{ height: "100%", padding: 0 }}
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

        <div className="px-4 pb-4">
          <NoriChatInput value={chat.input} onChange={chat.setInput} onSend={chat.handleSend} />
        </div>

        <div className="mx-4 mb-4">
          <NoriWeeklyInsight text={chat.insightText} />
        </div>

        <div className="px-4 pb-5">
          <NoriQuickActions
            onLogSpend={() => chat.setCheckInOpen(true)}
            onWhatIf={() => chat.setWhatIfOpen(true)}
            onNewGoal={() => router.push("/goals")}
          />
        </div>
      </div>

      <PurchaseAdviceDialog open={chat.purchaseOpen} onOpenChange={chat.setPurchaseOpen} />
      <WhatIfDialog open={chat.whatIfOpen} onOpenChange={chat.setWhatIfOpen} />
      <CheckInDialog open={chat.checkInOpen} onOpenChange={chat.setCheckInOpen} onSaved={chat.handleSaved} />
    </>
  );
}
