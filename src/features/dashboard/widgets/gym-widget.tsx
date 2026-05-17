"use client";

import Link from "next/link";
import { Dumbbell, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { exercisePRs, gymVolume } from "@/lib/analytics";

export function GymWidget() {
  const entries = useAppStore((s) => s.entries);
  const prs = exercisePRs(entries).slice(0, 4);
  const v7 = gymVolume(entries, 7);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-primary" /> Gym
          </CardTitle>
          <CardDescription>
            {v7 > 0 ? `${(v7 / 1000).toFixed(1)}t volume this week` : "No sessions yet"}
          </CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/gym">
            Open <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {prs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Log your first workout to track PRs and weekly volume.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-2">
            {prs.map((p) => (
              <div
                key={p.exerciseName}
                className="rounded-xl border border-border/60 bg-card/60 p-3 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs text-muted-foreground">PR</div>
                  <div className="font-medium text-sm truncate">{p.exerciseName}</div>
                </div>
                <div className="font-display text-lg font-bold gradient-text">
                  {p.weight} kg
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
