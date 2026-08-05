"use client";

import { Bell, LayoutDashboard, Lightbulb, LogOut, Target } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface NavbarProps {
  name?: string;
  onLogout?: () => void;
}

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/insights", label: "Insights", icon: Lightbulb },
];

function WaveIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c.5-2 2-3 3.5-3s3 2.5 5 2.5 3.5-3 5-3 3 1 3.5 3" />
    </svg>
  );
}

function initials(name?: string): string {
  if (!name) return "N";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "N";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function Navbar({ name, onLogout }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav
      className="glass-nav fixed left-1/2 top-5 z-[100] flex -translate-x-1/2 items-center gap-1 px-2 py-1.5"
      style={{ width: "min(880px, calc(100vw - 40px))" }}
    >
      <Link
        href="/dashboard"
        className="mr-2 flex items-center gap-2 rounded-[100px] px-3.5 py-1.5"
      >
        <span
          className="flex size-7 items-center justify-center rounded-[8px] text-white"
          style={{
            background: "linear-gradient(135deg, #6b7cff 0%, #a78bfa 100%)",
            boxShadow: "0 0 16px rgba(107,124,255,0.5)",
          }}
        >
          <WaveIcon />
        </span>
        <span
          className="text-[16px] font-bold tracking-tight text-foreground"
          style={{ letterSpacing: "-0.03em" }}
        >
          nori
        </span>
      </Link>

      <div className="flex flex-1 gap-0.5">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 rounded-[100px] px-4 py-1.5 text-[13.5px] font-medium transition-all duration-200"
              style={{
                background: active ? "rgba(255,255,255,0.1)" : "transparent",
                color: active ? "#f0f0f5" : "rgba(255,255,255,0.45)",
              }}
            >
              <Icon className="size-3.5" />
              {label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-1">
        <button
          aria-label="Notifications"
          className="relative flex size-8.5 items-center justify-center rounded-[100px] text-white/45 transition-colors hover:text-foreground"
        >
          <Bell className="size-4" />
          <span
            className="absolute right-2 top-2 size-1.5 rounded-full border"
            style={{ background: "#818cf8", borderColor: "#060608" }}
          />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn("ml-1 rounded-full outline-none", name ? "cursor-pointer" : "")}
          >
            <span
              className="flex size-8 select-none items-center justify-center rounded-full text-[12px] font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #6b7cff 0%, #a78bfa 100%)",
                boxShadow: "0 0 12px rgba(107,124,255,0.4)",
              }}
              title={name}
            >
              {initials(name)}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" sideOffset={10}>
            {name && (
              <DropdownMenuGroup>
                <DropdownMenuLabel className="max-w-[200px] truncate">{name}</DropdownMenuLabel>
              </DropdownMenuGroup>
            )}
            {name && <DropdownMenuSeparator />}
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => onLogout?.()}
              className="cursor-pointer"
            >
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
