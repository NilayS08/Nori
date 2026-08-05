"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";

import { MotionCard } from "@/components/dashboard/MotionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchaseAdviceDialog } from "@/components/ai/PurchaseAdviceDialog";

export function PurchaseAdviceCard({ delay = 0 }: { delay?: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <MotionCard delay={delay}>
        <Card className="flex h-full flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[18px]">
              <span className="flex size-8 items-center justify-center rounded-[10px] bg-blue-500/15 text-blue-400">
                <ShoppingBag className="size-4" />
              </span>
              Should I buy this?
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-3">
            <p className="flex-1 text-sm text-muted-foreground">
              Tell Nori the amount and it will check your budget, goals, and emergency fund
              before you decide.
            </p>
            <Button className="w-full" onClick={() => setOpen(true)}>
              Ask Nori
            </Button>
          </CardContent>
        </Card>
      </MotionCard>

      <PurchaseAdviceDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
