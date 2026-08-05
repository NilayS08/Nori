"use client";

import { FlaskConical, PiggyBank, Plus, Send, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

import { NoriMark } from "@/components/NoriMark";
import { cn } from "@/lib/utils";
import type { NoriMessage } from "@/components/ai/useNoriChat";

export function NoriChatHeader() {
  return (
    <div
      className="px-6 pb-4 pt-5"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "linear-gradient(180deg, rgba(107,124,255,0.06) 0%, transparent 100%)",
      }}
    >
      <div className="mb-1.5 flex items-center gap-2.5">
        <div
          className="flex size-8 items-center justify-center rounded-[10px] text-white"
          style={{
            background: "linear-gradient(135deg, #6b7cff 0%, #a78bfa 100%)",
            boxShadow: "0 0 16px rgba(107,124,255,0.4)",
          }}
        >
          <NoriMark size={15} />
        </div>
        <div>
          <div className="text-[14px] font-semibold text-foreground">Ask Nori</div>
          <div className="flex items-center gap-1">
            <span className="pulse-dot size-1.25 rounded-full" style={{ background: "#34d399" }} />
            <span className="text-[11px] text-white/35">Always watching your finances</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NoriChatThread({
  messages,
  typing,
  className,
}: {
  messages: NoriMessage[];
  typing: boolean;
  className?: string;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {messages.map((msg, i) => (
        <div
          key={i}
          className="flex items-start gap-2.5"
          style={{ flexDirection: msg.role === "user" ? "row-reverse" : "row" }}
        >
          {msg.role === "nori" && (
            <div
              className="flex size-7 shrink-0 items-center justify-center rounded-[8px] text-white"
              style={{
                background: "linear-gradient(135deg, #6b7cff 0%, #a78bfa 100%)",
                boxShadow: "0 0 10px rgba(107,124,255,0.3)",
              }}
            >
              <NoriMark size={12} />
            </div>
          )}
          <div
            className="max-w-[85%] px-3.5 py-3 text-[13px] leading-relaxed"
            style={{
              borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: msg.role === "user" ? "rgba(107,124,255,0.2)" : "rgba(255,255,255,0.05)",
              border:
                msg.role === "user"
                  ? "1px solid rgba(107,124,255,0.25)"
                  : "1px solid rgba(255,255,255,0.07)",
              color: msg.role === "user" ? "#e0e0f0" : "rgba(255,255,255,0.75)",
            }}
          >
            {msg.text}
          </div>
        </div>
      ))}

      {typing && (
        <div className="flex items-start gap-2.5">
          <div
            className="flex size-7 shrink-0 items-center justify-center rounded-[8px] text-white"
            style={{ background: "linear-gradient(135deg, #6b7cff 0%, #a78bfa 100%)" }}
          >
            <NoriMark size={12} />
          </div>
          <div
            className="flex items-center gap-1 rounded-[16px] px-4 py-3"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="pulse-dot size-1.25 rounded-full"
                style={{ background: "rgba(255,255,255,0.4)", animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}

export function NoriChatInput({
  value,
  onChange,
  onSend,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <div
      className="flex items-center gap-2 rounded-[100px] px-4 py-2.5"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        placeholder="Ask anything about your money..."
        className="flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-white/30"
      />
      <button
        onClick={onSend}
        className="flex size-8 items-center justify-center rounded-full transition-all"
        style={{
          background: value.trim()
            ? "linear-gradient(135deg, #6b7cff 0%, #a78bfa 100%)"
            : "rgba(255,255,255,0.07)",
          color: value.trim() ? "#fff" : "rgba(255,255,255,0.25)",
          boxShadow: value.trim() ? "0 0 12px rgba(107,124,255,0.5)" : "none",
        }}
      >
        <Send className="size-3.5" strokeWidth={2} />
      </button>
    </div>
  );
}

export function NoriSuggestions({
  suggestions,
  onPick,
}: {
  suggestions: string[];
  onPick: (suggestion: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => onPick(s)}
          className="cursor-pointer rounded-[100px] px-3 py-1.5 text-[12px] font-medium transition-colors"
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.5)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(107,124,255,0.4)";
            e.currentTarget.style.color = "#818cf8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
          }}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

export function NoriWeeklyInsight({ text }: { text: string }) {
  return (
    <div
      className="rounded-[16px] px-4 py-4"
      style={{
        background:
          "linear-gradient(135deg, rgba(107,124,255,0.1) 0%, rgba(167,139,250,0.08) 100%)",
        border: "1px solid rgba(107,124,255,0.15)",
      }}
    >
      <div className="mb-2 flex items-center gap-1.5">
        <Sparkles className="size-3.5" strokeWidth={1.5} style={{ color: "#818cf8" }} />
        <span
          className="text-[11px] font-semibold uppercase"
          style={{ color: "#818cf8", letterSpacing: "0.05em" }}
        >
          Weekly Insight
        </span>
      </div>
      <p className="m-0 text-[12.5px] leading-relaxed text-white/55">{text}</p>
    </div>
  );
}

export function NoriQuickActions({
  onLogSpend,
  onWhatIf,
  onNewGoal,
  className,
}: {
  onLogSpend: () => void;
  onWhatIf: () => void;
  onNewGoal: () => void;
  className?: string;
}) {
  const actions = [
    { label: "Log spend", icon: Plus, onClick: onLogSpend },
    { label: "What if…", icon: FlaskConical, onClick: onWhatIf },
    { label: "New goal", icon: PiggyBank, onClick: onNewGoal },
  ];

  return (
    <div className={cn("flex gap-2", className)}>
      {actions.map(({ label, icon: Icon, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          className="flex flex-1 cursor-pointer flex-col items-center gap-1.5 rounded-[12px] px-2 py-2.5 text-[11.5px] font-medium transition-colors"
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.5)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(107,124,255,0.08)";
            e.currentTarget.style.borderColor = "rgba(107,124,255,0.2)";
            e.currentTarget.style.color = "#818cf8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
          }}
        >
          <Icon className="size-4" strokeWidth={1.8} />
          {label}
        </button>
      ))}
    </div>
  );
}
