"use client";

import { motion } from "framer-motion";
import { Flame, Target, Activity, Dumbbell } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { currentStreak, gymVolume } from "@/lib/analytics";
import { todayIso } from "@/lib/date";

export function KpiGrid() {
  const trackers = useAppStore((s) => s.trackers);
  const entries = useAppStore((s) => s.entries);
  const profile = useAppStore((s) => s.profile);

  const habitTrackers = trackers.filter((t) => t.type === "boolean" && !t.archived);
  const today = todayIso();
  const doneToday = entries.filter(
    (e) => e.date === today && e.done && habitTrackers.some((t) => t.id === e.trackerId)
  ).length;

  const bestStreak = Math.max(
    0,
    ...habitTrackers.map((t) => currentStreak(t.id, entries))
  );
  const volume = gymVolume(entries, 7);
  const target = profile?.targetCalories;

  const items = [
    {
      label: "Streak",
      value: `${bestStreak}d`,
      icon: Flame,
      gradient: "from-violet-500 to-fuchsia-500",
      hint: bestStreak >= 7 ? "On fire" : "Keep going",
    },
    {
      label: "Today",
      value: `${doneToday}/${habitTrackers.length}`,
      icon: Target,
      gradient: "from-emerald-500 to-teal-500",
      hint:
        habitTrackers.length > 0
          ? `${Math.round((doneToday / habitTrackers.length) * 100)}% done`
          : "Add habits",
    },
    {
      label: "Gym volume",
      value: volume > 0 ? `${(volume / 1000).toFixed(1)}t` : "—",
      icon: Dumbbell,
      gradient: "from-rose-500 to-orange-500",
      hint: "Last 7 days",
    },
    {
      label: "Calories",
      value: target ? target.toLocaleString() : "—",
      icon: Activity,
      gradient: "from-sky-500 to-cyan-400",
      hint: target ? "Daily target" : "Set in profile",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {items.map((it, i) => (
        <motion.div
          key={it.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="card-premium p-4 sm:p-5 group"
        >
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {it.label}
            </div>
            <div
              className={`h-7 w-7 rounded-lg bg-gradient-to-br ${it.gradient} flex items-center justify-center text-white shadow-glow opacity-90 transition-transform group-hover:scale-110`}
            >
              <it.icon className="h-3.5 w-3.5" />
            </div>
          </div>
          <div
            className={`mt-3 font-display text-2xl sm:text-3xl font-bold bg-gradient-to-br ${it.gradient} bg-clip-text text-transparent`}
          >
            {it.value}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{it.hint}</div>
        </motion.div>
      ))}
    </div>
  );
}
