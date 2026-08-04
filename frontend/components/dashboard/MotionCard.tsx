"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MotionCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function MotionCard({ children, className, delay = 0 }: MotionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      className={cn("h-full", className)}
    >
      {children}
    </motion.div>
  );
}
