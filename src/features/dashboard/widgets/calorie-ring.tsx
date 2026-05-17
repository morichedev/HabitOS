"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { todayIso } from "@/lib/date";

export function CalorieRing() {
  const profile = useAppStore((s) => s.profile);
  const trackers = useAppStore((s) => s.trackers);
  const entries = useAppStore((s) => s.entries);

  const caloriesTracker = trackers.find((t) => t.type === "calories" && !t.archived);
  const today = todayIso();
  const consumed = caloriesTracker
    ? entries
        .filter((e) => e.trackerId === caloriesTracker.id && e.date === today)
        .reduce((sum, e) => sum + (e.value ?? 0), 0)
    : 0;
  const target = profile?.targetCalories ?? 0;
  const pct = target > 0 ? Math.min(100, Math.round((consumed / target) * 100)) : 0;
  const circumference = 2 * Math.PI * 56;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calories today</CardTitle>
        <CardDescription>
          {target ? `Target ${target.toLocaleString()} kcal` : (
            <Link href="/onboarding" className="text-primary hover:underline">
              Set up your goal
            </Link>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-6">
        <div className="relative h-36 w-36 shrink-0">
          <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
            <defs>
              <linearGradient id="caloriesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
            <circle
              cx="70"
              cy="70"
              r="56"
              stroke="hsl(var(--muted))"
              strokeWidth="12"
              fill="none"
            />
            <motion.circle
              cx="70"
              cy="70"
              r="56"
              stroke="url(#caloriesGrad)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-display text-2xl font-bold">{pct}%</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">of target</div>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <Row label="Consumed" value={`${consumed.toLocaleString()} kcal`} />
          <Row label="Remaining" value={`${Math.max(0, target - consumed).toLocaleString()} kcal`} />
          <Row label="Target" value={`${target.toLocaleString()} kcal`} muted />
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <span className="text-muted-foreground text-xs uppercase tracking-wider">{label}</span>
      <span className={muted ? "text-muted-foreground" : "font-medium"}>{value}</span>
    </div>
  );
}
