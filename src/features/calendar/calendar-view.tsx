"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { isoDate } from "@/lib/date";

export function CalendarView() {
  const [cursor, setCursor] = React.useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selected, setSelected] = React.useState(() => isoDate(new Date()));

  const trackers = useAppStore((s) => s.trackers);
  const entries = useAppStore((s) => s.entries);
  const trackerMap = new Map(trackers.map((t) => [t.id, t]));
  const habitTrackers = trackers.filter((t) => t.type === "boolean" && !t.archived);

  const monthLabel = cursor.toLocaleDateString("en", { month: "long", year: "numeric" });
  const start = new Date(cursor);
  const firstWeekday = (start.getDay() + 6) % 7; // Monday-start
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();

  const cells: ({ date: string; day: number } | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = isoDate(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    cells.push({ date, day: d });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  function shift(delta: number) {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
  }

  const dayEntries = entries.filter((e) => e.date === selected);

  return (
    <div className="container py-8 sm:py-10 space-y-6">
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Time view</div>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight">
          Calendar<span className="gradient-text">.</span>
        </h1>
        <p className="mt-1 text-muted-foreground">See your year, one day at a time.</p>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-5">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>{monthLabel}</CardTitle>
              <CardDescription>Tap a day to see entries.</CardDescription>
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" onClick={() => shift(-1)} aria-label="Previous month">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => shift(1)} aria-label="Next month">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 text-center text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {cells.map((cell, i) => {
                if (!cell) return <div key={`empty-${i}`} className="aspect-square" />;
                const dayEnts = entries.filter((e) => e.date === cell.date);
                const completedCount = habitTrackers.filter((t) =>
                  dayEnts.some((e) => e.trackerId === t.id && e.done)
                ).length;
                const intensity = habitTrackers.length
                  ? completedCount / habitTrackers.length
                  : 0;
                const isSelected = cell.date === selected;
                const isToday = cell.date === isoDate(new Date());
                return (
                  <motion.button
                    key={cell.date}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelected(cell.date)}
                    className={`aspect-square rounded-xl border flex flex-col items-center justify-center text-xs font-medium relative transition-all ${
                      isSelected
                        ? "border-primary ring-1 ring-primary/40 bg-primary/10"
                        : "border-border/50 hover:border-border bg-card/40"
                    }`}
                  >
                    <div
                      className="absolute inset-1 rounded-lg -z-0 opacity-80"
                      style={{
                        background:
                          intensity > 0
                            ? `hsl(256, 92%, ${75 - intensity * 30}%)`
                            : "transparent",
                      }}
                    />
                    <span className={`relative ${isToday ? "font-bold" : ""}`}>{cell.day}</span>
                    {dayEnts.length > 0 && (
                      <span className="relative text-[9px] text-muted-foreground">
                        {dayEnts.length}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {new Date(selected).toLocaleDateString("en", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })}
            </CardTitle>
            <CardDescription>
              {dayEntries.length} {dayEntries.length === 1 ? "entry" : "entries"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {dayEntries.length === 0 ? (
              <div className="text-sm text-muted-foreground">No entries on this day.</div>
            ) : (
              dayEntries.map((e) => {
                const t = trackerMap.get(e.trackerId);
                return (
                  <div
                    key={e.id}
                    className="rounded-xl border border-border/60 bg-card/60 px-3 py-2 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ background: t?.color ?? "hsl(var(--primary))" }}
                      />
                      <span className="text-sm font-medium truncate">{t?.name ?? "?"}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {e.done ? "Done" : e.value != null ? `${e.value} ${t?.unit ?? ""}` : "—"}
                    </span>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
