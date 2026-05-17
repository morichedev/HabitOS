import {
  addDays,
  differenceInCalendarDays,
  endOfWeek,
  format,
  isToday as fnsIsToday,
  parseISO,
  startOfWeek,
  subDays,
} from "date-fns";

/** Format a Date as YYYY-MM-DD (local). */
export function isoDate(d: Date = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayIso() {
  return isoDate(new Date());
}

export function parseIso(date: string) {
  return parseISO(date);
}

export function isToday(date: string) {
  return fnsIsToday(parseIso(date));
}

export function rangeDays(days: number, end: Date = new Date()) {
  return Array.from({ length: days }).map((_, i) => isoDate(subDays(end, days - 1 - i)));
}

export function weekDates(weekStart: "mon" | "sun" = "mon", anchor: Date = new Date()) {
  const start = startOfWeek(anchor, { weekStartsOn: weekStart === "mon" ? 1 : 0 });
  const end = endOfWeek(anchor, { weekStartsOn: weekStart === "mon" ? 1 : 0 });
  const out: string[] = [];
  for (let d = start; d <= end; d = addDays(d, 1)) out.push(isoDate(d));
  return out;
}

export function prettyDate(date: string) {
  return format(parseIso(date), "EEE, d MMM");
}

export function daysBetween(a: string, b: string) {
  return Math.abs(differenceInCalendarDays(parseIso(a), parseIso(b)));
}
