"use client";

import { LogOut } from "lucide-react";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  name?: string;
  onLogout?: () => void;
}

export function Navbar({ name, onLogout }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Logo />
        <div className="flex items-center gap-2">
          {name && (
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {name}
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
