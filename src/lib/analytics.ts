import type { Entry, Tracker } from "./schemas";
import { rangeDays, todayIso } from "./date";

/** Compute current streak for a daily tracker (consecutive days with done/value entries). */
export function currentStreak(trackerId: string, entries: Entry[]) {
  const set = new Set(
    entries
      .filter((e) => e.trackerId === trackerId && (e.done || (e.value ?? 0) > 0))
      .map((e) => e.date)
  );
  let streak = 0;
  const d = new Date();
  // start from today, walk backwards
  for (;;) {
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (set.has(iso)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      // allow grace for today (don't count today as breaking the streak if not yet done)
      if (streak === 0 && iso === todayIso()) {
        d.setDate(d.getDate() - 1);
        continue;
      }
      break;
    }
  }
  return streak;
}

/** Heatmap: array of {date, value 0..1} for last N days. */
export function heatmap(trackerId: string, entries: Entry[], days = 91) {
  const days_ = rangeDays(days);
  const byDate = new Map<string, number>();
  for (const e of entries) {
    if (e.trackerId !== trackerId) continue;
    const v = e.done ? 1 : Math.min(1, (e.value ?? 0) / 100);
    byDate.set(e.date, Math.max(byDate.get(e.date) ?? 0, v));
  }
  return days_.map((date) => ({ date, value: byDate.get(date) ?? 0 }));
}

/** Series of daily totals for a numeric tracker. */
export function dailySeries(trackerId: string, entries: Entry[], days = 30) {
  const dates = rangeDays(days);
  const byDate = new Map<string, number>();
  for (const e of entries) {
    if (e.trackerId !== trackerId) continue;
    byDate.set(e.date, (byDate.get(e.date) ?? 0) + (e.value ?? (e.done ? 1 : 0)));
  }
  return dates.map((date) => ({ date, value: byDate.get(date) ?? 0 }));
}

/** Weekly progress 0..1 — fraction of habit trackers completed today across the week. */
export function weeklyCompletion(trackers: Tracker[], entries: Entry[], days = 7) {
  const dates = rangeDays(days);
  const habitTrackers = trackers.filter((t) => t.type === "boolean" && !t.archived);
  if (habitTrackers.length === 0) return dates.map((date) => ({ date, value: 0 }));
  return dates.map((date) => {
    const total = habitTrackers.length;
    const done = entries.filter(
      (e) => e.date === date && e.done && habitTrackers.some((t) => t.id === e.trackerId)
    ).length;
    return { date, value: done / total };
  });
}

/** Estimated personal records (max weight per exercise across all entries). */
export function exercisePRs(entries: Entry[]) {
  const map = new Map<string, number>();
  for (const e of entries) {
    if (!e.exercises) continue;
    for (const ex of e.exercises) {
      const max = Math.max(...ex.sets.map((s) => s.weight), 0);
      map.set(ex.exerciseName, Math.max(map.get(ex.exerciseName) ?? 0, max));
    }
  }
  return [...map.entries()]
    .map(([exerciseName, weight]) => ({ exerciseName, weight }))
    .sort((a, b) => b.weight - a.weight);
}

/** Weekly gym volume = sum(reps * weight) for last N days. */
export function gymVolume(entries: Entry[], days = 7) {
  const dates = new Set(rangeDays(days));
  let volume = 0;
  for (const e of entries) {
    if (!dates.has(e.date) || !e.exercises) continue;
    for (const ex of e.exercises) {
      for (const s of ex.sets) volume += s.reps * s.weight;
    }
  }
  return Math.round(volume);
}

/** Lightweight insight generator. Returns 1-3 friendly insights. */
export function generateInsights(trackers: Tracker[], entries: Entry[]): string[] {
  const out: string[] = [];
  // Best weekday
  const counts = Array.from({ length: 7 }, () => 0);
  for (const e of entries.filter((e) => e.done)) {
    const d = new Date(e.date);
    counts[d.getDay()]++;
  }
  const max = Math.max(...counts);
  if (max > 0) {
    const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][counts.indexOf(max)];
    out.push(`Your most consistent day is ${day} — keep that momentum.`);
  }
  // Streak champion
  const best = trackers
    .map((t) => ({ t, streak: currentStreak(t.id, entries) }))
    .sort((a, b) => b.streak - a.streak)[0];
  if (best && best.streak >= 3) {
    out.push(`${best.t.name} is on a ${best.streak}-day streak. You're building something real.`);
  }
  // Volume trend (gym)
  const v7 = gymVolume(entries, 7);
  const v14 = gymVolume(entries, 14) - v7;
  if (v14 > 0) {
    const delta = Math.round(((v7 - v14) / v14) * 100);
    if (Math.abs(delta) >= 5) {
      out.push(
        delta > 0
          ? `Gym volume up ${delta}% vs last week. Strong progressive overload.`
          : `Gym volume down ${Math.abs(delta)}% — might be a deload week.`
      );
    }
  }
  if (out.length === 0) {
    out.push("Log a few days of data and your personal insights will appear here.");
  }
  return out.slice(0, 3);
}
