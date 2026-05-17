"use client";

import * as React from "react";
import { GraduationCap, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/lib/store";
import { todayIso, rangeDays } from "@/lib/date";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function StudyView() {
  const trackers = useAppStore((s) => s.trackers);
  const entries = useAppStore((s) => s.entries);
  const logEntry = useAppStore((s) => s.logEntry);
  const createTracker = useAppStore((s) => s.createTracker);

  const studyTrackers = trackers.filter((t) => t.category === "study" && !t.archived);
  const [trackerId, setTrackerId] = React.useState(studyTrackers[0]?.id ?? "");
  const [value, setValue] = React.useState<number>(0);

  React.useEffect(() => {
    if (!trackerId && studyTrackers[0]?.id) setTrackerId(studyTrackers[0].id);
  }, [studyTrackers, trackerId]);

  async function ensureStudyTracker() {
    if (studyTrackers.length === 0) {
      const t = await createTracker({
        name: "Study",
        category: "study",
        type: "duration",
        icon: "GraduationCap",
        color: "#7C5CFF",
        unit: "min",
        frequency: "daily",
        targetMin: 60,
      });
      setTrackerId(t.id);
    }
  }

  React.useEffect(() => {
    ensureStudyTracker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function log() {
    if (!trackerId || !value) return;
    await logEntry({ trackerId, date: todayIso(), value });
    setValue(0);
  }

  // Last 14 days
  const dates = rangeDays(14);
  const series = dates.map((d) => {
    const total = entries
      .filter((e) => e.date === d && studyTrackers.some((t) => t.id === e.trackerId))
      .reduce((s, e) => s + (e.value ?? 0), 0);
    return {
      date: d,
      day: new Date(d).toLocaleDateString("en", { day: "numeric", month: "short" }),
      minutes: total,
    };
  });
  const totalWeek = series.slice(-7).reduce((s, x) => s + x.minutes, 0);

  return (
    <div className="container py-8 sm:py-10 space-y-6">
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Deep work</div>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight">
          Study<span className="gradient-text">.</span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          {Math.round(totalWeek / 60)}h logged this week.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" /> Quick log
          </CardTitle>
          <CardDescription>Add a study session.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1 space-y-2">
              <Label>Minutes today</Label>
              <Input
                type="number"
                min={0}
                placeholder="e.g. 45"
                value={value || ""}
                onChange={(e) => setValue(Number(e.target.value))}
              />
            </div>
            <Button variant="gradient" size="lg" onClick={log} disabled={!value}>
              <Plus className="h-4 w-4" /> Log session
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Last 14 days</CardTitle>
          <CardDescription>Study minutes per day.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={series} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="studyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--info))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--info))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 6" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickLine={false} axisLine={false} unit="m" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => `${v} min`}
                />
                <Area type="monotone" dataKey="minutes" stroke="hsl(var(--info))" strokeWidth={2} fill="url(#studyGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
