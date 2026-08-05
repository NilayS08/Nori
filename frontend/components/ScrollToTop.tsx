"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
