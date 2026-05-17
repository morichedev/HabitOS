"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { weeklyCompletion, generateInsights, currentStreak } from "@/lib/analytics";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#7C5CFF", "#22D3EE", "#34D399", "#F472B6", "#F59E0B", "#60A5FA", "#A78BFA", "#F87171"];

export function AnalyticsView() {
  const trackers = useAppStore((s) => s.trackers);
  const entries = useAppStore((s) => s.entries);

  const series = weeklyCompletion(trackers, entries, 60).map((d) => ({
    ...d,
    value: Math.round(d.value * 100),
    day: new Date(d.date).toLocaleDateString("en", { day: "numeric", month: "short" }),
  }));

  // By day of week (last 60d)
  const byWeekday = Array.from({ length: 7 }, (_, i) => ({
    name: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i],
    count: 0,
  }));
  for (const e of entries.filter((e) => e.done)) {
    byWeekday[new Date(e.date).getDay()].count++;
  }

  // Pie by category
  const byCategory: Record<string, number> = {};
  for (const t of trackers) {
    byCategory[t.category] = (byCategory[t.category] ?? 0) + entries.filter((e) => e.trackerId === t.id).length;
  }
  const pieData = Object.entries(byCategory)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  // Streak leaderboard
  const streakBoard = trackers
    .filter((t) => t.type === "boolean")
    .map((t) => ({ tracker: t, streak: currentStreak(t.id, entries) }))
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 5);

  const insights = generateInsights(trackers, entries);

  return (
    <div className="container py-8 sm:py-10 space-y-6">
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Patterns & progress</div>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight">
          Analytics<span className="gradient-text">.</span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          The shape of your last two months, in one place.
        </p>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>What the data says</CardTitle>
          <CardDescription>Automatic patterns from your history.</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-3">
          {insights.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-xl border border-border/60 bg-muted/30 p-4 text-sm leading-relaxed"
            >
              <span className="gradient-text font-bold mr-1">✦</span>
              {line}
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Momentum — 60 days</CardTitle>
            <CardDescription>Daily habit completion %.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer>
                <AreaChart data={series} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="anaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 6" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickLine={false} axisLine={false} interval={6} />
                  <YAxis domain={[0, 100]} unit="%" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#anaGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best weekdays</CardTitle>
            <CardDescription>When you ship the most.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={byWeekday}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Time by category</CardTitle>
            <CardDescription>Where your attention goes.</CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <div className="h-64 grid place-items-center text-sm text-muted-foreground">
                Log some entries to see breakdown.
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Streak leaderboard</CardTitle>
            <CardDescription>Your longest active streaks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {streakBoard.length === 0 ? (
              <div className="text-sm text-muted-foreground">No habits yet.</div>
            ) : (
              streakBoard.map(({ tracker, streak }, i) => (
                <div
                  key={tracker.id}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-card/60 px-3 py-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs text-muted-foreground w-6">#{i + 1}</span>
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ background: tracker.color }} />
                    <span className="text-sm font-medium truncate">{tracker.name}</span>
                  </div>
                  <span className="font-display font-bold gradient-text">{streak}d</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
