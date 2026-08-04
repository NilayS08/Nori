import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { step: 1, label: "Your finances" },
  { step: 2, label: "Your goal" },
];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-3">
      {steps.map((s, i) => {
        const active = s.step === current;
        const done = s.step < current;
        return (
          <div key={s.step} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-all duration-300",
                  done && "bg-primary text-primary-foreground",
                  active &&
                    "bg-primary/15 text-primary ring-1 ring-primary/40",
                  !active && !done && "bg-muted text-muted-foreground",
                )}
              >
                {done ? <Check className="size-4" /> : s.step}
              </span>
              <span
                className={cn(
                  "text-sm transition-colors",
                  active || done ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span
                className={cn(
                  "h-px w-8 transition-colors duration-300",
                  done ? "bg-primary/50" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
