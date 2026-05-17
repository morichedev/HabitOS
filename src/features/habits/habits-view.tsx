"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Plus, Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { todayIso, rangeDays, weekDates } from "@/lib/date";
import { currentStreak } from "@/lib/analytics";
import { HabitFormDialog } from "./habit-form-dialog";
import type { Tracker } from "@/lib/schemas";
import { cn } from "@/lib/utils";

export function HabitsView() {
  const params = useSearchParams();
  const trackers = useAppStore((s) => s.trackers);
  const entries = useAppStore((s) => s.entries);
  const toggleHabit = useAppStore((s) => s.toggleHabit);
  const removeTracker = useAppStore((s) => s.removeTracker);
  const settings = useAppStore((s) => s.settings);

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Tracker | null>(null);

  React.useEffect(() => {
    if (params.get("new") === "1") setDialogOpen(true);
  }, [params]);

  const habitTrackers = trackers.filter(
    (t) => (t.type === "boolean" || t.type === "count" || t.type === "duration") && !t.archived
  );
  const today = todayIso();
  const week = weekDates(settings.weekStart);

  return (
    <div className="container py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Build the system
          </div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Habits<span className="gradient-text">.</span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            {habitTrackers.length} {habitTrackers.length === 1 ? "habit" : "habits"} · Tap a day to toggle
          </p>
        </div>
        <Button
          variant="gradient"
          size="lg"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> New habit
        </Button>
      </div>

      {/* Habit grid */}
      <div className="grid gap-3">
        <AnimatePresence>
          {habitTrackers.map((tracker, i) => {
            const streak = currentStreak(tracker.id, entries);
            const trackerEntries = entries.filter((e) => e.trackerId === tracker.id);
            const doneSet = new Set(trackerEntries.filter((e) => e.done).map((e) => e.date));

            return (
              <motion.div
                key={tracker.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: `${tracker.color}25`, color: tracker.color }}
                        >
                          <span className="font-bold">{tracker.name[0]?.toUpperCase()}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-display font-semibold tracking-tight truncate">
                              {tracker.name}
                            </h3>
                            {streak >= 3 && (
                              <Badge variant="default" className="gap-1">
                                <Flame className="h-3 w-3" /> {streak}d
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-[10px]">
                              {tracker.category}
                            </Badge>
                          </div>
                          {tracker.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                              {tracker.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditing(tracker);
                            setDialogOpen(true);
                          }}
                          aria-label="Edit"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm(`Delete "${tracker.name}"?`)) removeTracker(tracker.id);
                          }}
                          aria-label="Delete"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Week strip */}
                    <div className="mt-5 grid grid-cols-7 gap-1.5 sm:gap-2">
                      {week.map((date) => {
                        const done = doneSet.has(date);
                        const isToday = date === today;
                        const label = new Date(date).toLocaleDateString("en", { weekday: "short" })[0];
                        return (
                          <button
                            key={date}
                            onClick={() => toggleHabit(tracker.id, date)}
                            className={cn(
                              "group relative aspect-square rounded-xl border transition-all flex flex-col items-center justify-center gap-1",
                              done
                                ? "border-transparent text-primary-foreground shadow-glow"
                                : "border-border/60 hover:border-border bg-card/50",
                              isToday && !done && "ring-1 ring-primary/50"
                            )}
                            style={done ? { background: tracker.color } : undefined}
                            title={date}
                          >
                            <span className={cn("text-[10px]", done ? "" : "text-muted-foreground")}>
                              {label}
                            </span>
                            <span className="text-xs font-semibold">
                              {new Date(date).getDate()}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Last 30 days mini-heatmap */}
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">
                        30d
                      </span>
                      <div className="flex gap-0.5">
                        {rangeDays(30).map((d) => (
                          <div
                            key={d}
                            className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-sm"
                            style={{
                              background: doneSet.has(d)
                                ? tracker.color
                                : "hsl(var(--muted))",
                              opacity: doneSet.has(d) ? 0.9 : 0.5,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {habitTrackers.length === 0 && (
          <Card className="p-10 text-center">
            <div className="mx-auto mb-4 h-14 w-14 rounded-2xl gradient-brand flex items-center justify-center shadow-glow">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-display text-lg font-semibold">No habits yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first habit to start building momentum.
            </p>
            <Button
              variant="gradient"
              className="mt-4"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="h-4 w-4" /> Add habit
            </Button>
          </Card>
        )}
      </div>

      <HabitFormDialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) setEditing(null);
        }}
        editing={editing}
      />
    </div>
  );
}
