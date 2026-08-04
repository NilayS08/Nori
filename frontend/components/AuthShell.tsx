import { Logo } from "@/components/Logo";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <main className="ambient relative flex min-h-dvh items-center justify-center overflow-hidden bg-background p-4">
      <div className="relative z-10 flex w-full max-w-[420px] animate-in flex-col items-center gap-8 fade-in slide-in-from-bottom-4 duration-500">
        <Logo />

        <div className="glass w-full rounded-[24px] p-8 shadow-soft">
          <div className="mb-6 space-y-1.5">
            <h1 className="font-heading text-[28px] font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="text-[15px] text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>

        <p className="text-[13px] text-muted-foreground">
          Know exactly how much you can safely spend.
        </p>
      </div>
    </main>
  );
}
