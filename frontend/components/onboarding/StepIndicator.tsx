import { cn } from "@/lib/utils";

const steps = [
  { step: 1, label: "Your finances" },
  { step: 2, label: "Your goal" },
];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((s, i) => (
        <div key={s.step} className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-7 items-center justify-center rounded-full text-xs font-medium transition-colors",
              s.step <= current
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground",
            )}
          >
            {s.step}
          </div>
          <span
            className={cn(
              "text-sm transition-colors",
              s.step <= current ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {s.label}
          </span>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "mx-1 h-px w-6 transition-colors",
                s.step < current ? "bg-foreground" : "bg-border",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
