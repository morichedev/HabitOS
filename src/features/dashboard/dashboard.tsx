"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { KpiGrid } from "./widgets/kpi-grid";
import { TodayHabits } from "./widgets/today-habits";
import { HeatmapWidget } from "./widgets/heatmap";
import { WeeklyProgressChart } from "./widgets/weekly-progress-chart";
import { InsightsWidget } from "./widgets/insights";
import { GymWidget } from "./widgets/gym-widget";
import { CalorieRing } from "./widgets/calorie-ring";
import { TimelineWidget } from "./widgets/timeline";
import { EmptyState } from "./empty-state";

const AmbientGlow = dynamic(
  () => import("@/components/three/ambient-glow").then((m) => m.AmbientGlow),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 -z-10 bg-aurora opacity-30 blur-3xl" />
    ),
  }
);

export function Dashboard() {
  const status = useAppStore((s) => s.status);
  const profile = useAppStore((s) => s.profile);
  const trackers = useAppStore((s) => s.trackers);

  const greeting = React.useMemo(() => {
    const h = new Date().getHours();
    if (h < 5) return "Late night";
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  if (status !== "ready") {
    return (
      <div className="container py-10 space-y-3">
        <div className="h-12 w-64 shimmer rounded-xl" />
        <div className="h-24 w-full shimmer rounded-2xl" />
        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          <div className="h-32 shimmer rounded-2xl" />
          <div className="h-32 shimmer rounded-2xl" />
          <div className="h-32 shimmer rounded-2xl" />
        </div>
      </div>
    );
  }

  if (trackers.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="relative">
      {/* Hero header with ambient 3D */}
      <section className="relative isolate overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-grid opacity-[0.06] mask-fade-b" />
        <AmbientGlow className="absolute right-0 top-0 h-[420px] w-[520px] -z-10 opacity-60" />
        <div className="container py-10 sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
          >
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {new Date().toLocaleDateString("en", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight">
                {greeting}
                {profile?.name ? `, ${profile.name}` : ""}
                <span className="gradient-text">.</span>
              </h1>
              <p className="mt-2 text-muted-foreground max-w-md">
                Here's the shape of your day. Small wins compound.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="lg" asChild>
                <a href="/habits">
                  <Sparkles className="h-4 w-4" /> View habits
                </a>
              </Button>
              <Button variant="gradient" size="lg" asChild>
                <a href="/habits?new=1">
                  <Plus className="h-4 w-4" /> New tracker
                </a>
              </Button>
            </div>
          </motion.div>

          <div className="mt-8">
            <KpiGrid />
          </div>
        </div>
      </section>

      {/* Main grid */}
      <section className="container py-8 grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-5">
          <TodayHabits />
          <WeeklyProgressChart />
          <HeatmapWidget />
          <GymWidget />
        </div>
        <div className="lg:col-span-4 space-y-5">
          <CalorieRing />
          <InsightsWidget />
          <TimelineWidget />
        </div>
      </section>
    </div>
  );
}
