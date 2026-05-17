"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Dumbbell, Plus, Trophy, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { exercisePRs, gymVolume } from "@/lib/analytics";
import { rangeDays } from "@/lib/date";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { WorkoutDialog } from "./workout-dialog";

export function GymView() {
  const trackers = useAppStore((s) => s.trackers);
  const entries = useAppStore((s) => s.entries);
  const createTracker = useAppStore((s) => s.createTracker);

  const [open, setOpen] = React.useState(false);

  // Ensure a "Workout" gym tracker exists for entries
  const workoutTracker = trackers.find((t) => t.type === "exercise");
  React.useEffect(() => {
    if (!workoutTracker) {
      createTracker({
        name: "Workout",
        category: "gym",
        type: "exercise",
        icon: "Dumbbell",
        color: "#7C5CFF",
        frequency: "daily",
      });
    }
  }, [workoutTracker, createTracker]);

  const prs = exercisePRs(entries);
  const v7 = gymVolume(entries, 7);
  const v14 = gymVolume(entries, 14) - v7;
  const trend = v14 > 0 ? Math.round(((v7 - v14) / v14) * 100) : 0;

  // Volume series
  const series = rangeDays(14).map((date) => {
    let v = 0;
    for (const e of entries) {
      if (e.date !== date || !e.exercises) continue;
      for (const ex of e.exercises) for (const s of ex.sets) v += s.reps * s.weight;
    }
    return {
      date,
      day: new Date(date).toLocaleDateString("en", { day: "numeric", month: "short" }),
      volume: Math.round(v),
    };
  });

  const recent = [...entries]
    .filter((e) => e.exercises && e.exercises.length > 0)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 6);

  return (
    <div className="container py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Strength · Volume · PRs</div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Gym<span className="gradient-text">.</span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            Log sets, reps and weight. Watch your numbers climb.
          </p>
        </div>
        <Button variant="gradient" size="lg" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Log workout
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Kpi
          label="Volume (7d)"
          value={v7 > 0 ? `${(v7 / 1000).toFixed(1)}t` : "0"}
          hint={v7 > 0 ? "kg lifted" : "Log a workout"}
          gradient="from-violet-500 to-fuchsia-500"
          icon={Dumbbell}
        />
        <Kpi
          label="Trend"
          value={`${trend > 0 ? "+" : ""}${trend}%`}
          hint="vs last week"
          gradient="from-emerald-500 to-teal-500"
          icon={TrendingUp}
        />
        <Kpi
          label="PRs tracked"
          value={prs.length.toString()}
          hint="distinct lifts"
          gradient="from-rose-500 to-orange-500"
          icon={Trophy}
        />
        <Kpi
          label="Sessions (14d)"
          value={recent.length.toString()}
          hint="workouts logged"
          gradient="from-sky-500 to-cyan-400"
          icon={Dumbbell}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Volume — last 14 days</CardTitle>
            <CardDescription>Total weight lifted per day (reps × weight).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={series} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gymGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 6" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                    formatter={(v: number) => `${v.toLocaleString()} kg`}
                  />
                  <Bar dataKey="volume" fill="url(#gymGrad)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal records</CardTitle>
            <CardDescription>Heaviest weight per exercise.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {prs.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                Your PRs will appear here after your first workout.
              </div>
            ) : (
              prs.slice(0, 8).map((p, i) => (
                <motion.div
                  key={p.exerciseName}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-card/60 px-3 py-2"
                >
                  <span className="text-sm font-medium truncate">{p.exerciseName}</span>
                  <span className="font-display font-bold gradient-text">{p.weight} kg</span>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent sessions</CardTitle>
          <CardDescription>Latest workouts you've logged.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recent.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <Dumbbell className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">No sessions logged yet.</p>
              <Button variant="gradient" className="mt-4" onClick={() => setOpen(true)}>
                <Plus className="h-4 w-4" /> Log your first workout
              </Button>
            </div>
          ) : (
            recent.map((entry) => (
              <div
                key={entry.id}
                className="rounded-xl border border-border/60 bg-card/60 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">
                    {new Date(entry.date).toLocaleDateString("en", {
                      weekday: "long",
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {entry.exercises?.length ?? 0} exercises
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {entry.exercises?.map((ex, i) => (
                    <div key={i} className="rounded-lg bg-muted/40 px-3 py-2 text-sm">
                      <div className="font-medium">{ex.exerciseName}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {ex.sets.map((s) => `${s.reps}×${s.weight}kg`).join(" · ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <WorkoutDialog open={open} onOpenChange={setOpen} trackerId={workoutTracker?.id} />
    </div>
  );
}

function Kpi({
  label,
  value,
  hint,
  gradient,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: string;
  gradient: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="card-premium p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div
          className={`h-7 w-7 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-glow`}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className={`mt-3 font-display text-2xl sm:text-3xl font-bold bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
        {value}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}
