import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge tailwind classes with proper conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number into compact form: 1.2k, 3.4M. */
export function formatCompact(n: number) {
  return Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

/** Plural helper. */
export function pluralize(n: number, one: string, many: string) {
  return n === 1 ? one : many;
}

/** Clamp a number between min and max. */
export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

/** Convert hex to HSL string used in CSS variables. */
export function isClient() {
  return typeof window !== "undefined";
}

/** Deterministic hash for color assignment. */
export function stringHash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Pick a deterministic accent color for a given key. */
export const ACCENT_PALETTE = [
  "#7C5CFF", // primary violet
  "#22D3EE", // cyan accent
  "#34D399", // emerald
  "#F472B6", // pink
  "#F59E0B", // amber
  "#60A5FA", // blue
  "#A78BFA", // light violet
  "#F87171", // red
];

export function pickColor(key: string) {
  return ACCENT_PALETTE[stringHash(key) % ACCENT_PALETTE.length];
}
