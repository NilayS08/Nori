import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-soft">
        <Leaf className="size-5" />
      </span>
      <span className="text-xl font-semibold tracking-tight">Nori</span>
    </span>
  );
}
