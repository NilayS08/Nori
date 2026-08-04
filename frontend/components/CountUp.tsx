"use client";

import { animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { formatMoney } from "@/lib/format";

interface CountUpProps {
  value: number;
  prefix?: string;
  duration?: number;
  className?: string;
  format?: boolean;
}

export function CountUp({
  value,
  prefix = "",
  duration = 0.8,
  className,
  format = true,
}: CountUpProps) {
  const [display, setDisplay] = useState(format ? formatMoney(0) : "0");
  const prev = useRef(0);

  useEffect(() => {
    const controls = animate(prev.current, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => {
        if (format) {
          setDisplay(formatMoney(latest));
        } else {
          setDisplay(Math.round(latest).toString());
        }
      },
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, duration, format]);

  return (
    <span className={className}>
      {prefix}
      {display}
    </span>
  );
}
