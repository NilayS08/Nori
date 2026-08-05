"use client";

import { FlaskConical } from "lucide-react";
import { useState } from "react";

import { MotionCard } from "@/components/dashboard/MotionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WhatIfDialog } from "@/components/ai/WhatIfDialog";

export function WhatIfCard({ delay = 0 }: { delay?: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <MotionCard delay={delay}>
        <Card className="flex h-full flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[18px]">
              <span className="flex size-8 items-center justify-center rounded-[10px] bg-violet-500/15 text-violet-400">
                <FlaskConical className="size-4" />
              </span>
              What if…
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-3">
            <p className="flex-1 text-sm text-muted-foreground">
              Simulate earning more, spending more, or a one-time purchase — and see the impact
              on your plan before it happens.
            </p>
            <Button className="w-full" onClick={() => setOpen(true)}>
              Simulate
            </Button>
          </CardContent>
        </Card>
      </MotionCard>

      <WhatIfDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
