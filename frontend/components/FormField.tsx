import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export function FormField({ label, htmlFor, error, hint, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {hint && !error && <span className="text-xs text-muted-foreground">{hint}</span>}
      {error && <span className="text-xs text-rose-400">{error}</span>}
    </div>
  );
}

interface FieldLabelProps {
  className?: string;
  children: React.ReactNode;
}

export function FieldLabel({ className, children }: FieldLabelProps) {
  return (
    <span className={cn("text-sm font-medium text-foreground", className)}>
      {children}
    </span>
  );
}
