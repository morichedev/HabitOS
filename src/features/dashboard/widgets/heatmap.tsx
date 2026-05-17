"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { heatmap } from "@/lib/analytics";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { prettyDate } from "@/lib/date";

export function HeatmapWidget() {
  const trackers = useAppStore((s) => s.trackers);
  const entries = useAppStore((s) => s.entries);
  const habit = trackers.find((t) => t.type === "boolean" && !t.archived);
  const cells = habit ? heatmap(habit.id, entries, 91) : heatmap("__none__", [], 91);

  // Group into weeks
  const weeks: { date: string; value: number }[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const total = cells.filter((c) => c.value > 0).length;
  const pct = Math.round((total / cells.length) * 100);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Consistency</CardTitle>
          <CardDescription>
            {habit ? `${habit.name} · last 91 days` : "Last 91 days"}
          </CardDescription>
        </div>
        <div className="text-sm text-muted-foreground">{pct}%</div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-rows-7 gap-1">
              {week.map((cell) => (
                <Tooltip key={cell.date}>
                  <TooltipTrigger asChild>
                    <div
                      className="h-3 w-3 rounded-sm transition-transform hover:scale-150 hover:shadow-glow"
                      style={{
                        background:
                          cell.value === 0
                            ? "hsl(var(--muted))"
                            : `hsl(256, 92%, ${72 - cell.value * 25}%)`,
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {prettyDate(cell.date)} — {cell.value > 0 ? "done" : "no entry"}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <span>Less</span>
          {[0, 0.3, 0.6, 1].map((v) => (
            <div
              key={v}
              className="h-3 w-3 rounded-sm"
              style={{
                background:
                  v === 0 ? "hsl(var(--muted))" : `hsl(256, 92%, ${72 - v * 25}%)`,
              }}
            />
          ))}
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
