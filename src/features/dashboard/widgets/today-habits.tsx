"use client";

import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { todayIso } from "@/lib/date";
import { Progress } from "@/components/ui/progress";

export function TodayHabits() {
  const trackers = useAppStore((s) => s.trackers);
  const entries = useAppStore((s) => s.entries);
  const toggleHabit = useAppStore((s) => s.toggleHabit);

  const habits = trackers
    .filter((t) => t.type === "boolean" && !t.archived)
    .slice(0, 6);
  const today = todayIso();
  const doneIds = new Set(
    entries.filter((e) => e.date === today && e.done).map((e) => e.trackerId)
  );
  const pct = habits.length ? Math.round((doneIds.size / habits.length) * 100) : 0;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Today</CardTitle>
          <CardDescription>
            {doneIds.size} of {habits.length} habits complete · {pct}%
          </CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/habits">View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={pct} className="h-1.5" />
        <div className="grid gap-2">
          {habits.length === 0 ? (
            <Link
              href="/habits?new=1"
              className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-6 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
            >
              <Plus className="h-4 w-4" /> Add your first habit
            </Link>
          ) : (
            habits.map((t, i) => {
              const done = doneIds.has(t.id);
              return (
                <motion.button
                  key={t.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  onClick={() => toggleHabit(t.id)}
                  className={`group w-full flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-all ${
                    done
                      ? "bg-primary/5 border-primary/30"
                      : "bg-card border-border/60 hover:border-border"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-6 w-6 rounded-md flex items-center justify-center border-2 transition-all ${
                        done
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border group-hover:border-primary/50"
                      }`}
                    >
                      {done && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <div
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ background: t.color }}
                    />
                    <span
                      className={`text-sm truncate ${
                        done ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {t.name}
                    </span>
                  </div>
                  {t.unit && (
                    <span className="text-xs text-muted-foreground shrink-0">{t.unit}</span>
                  )}
                </motion.button>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
