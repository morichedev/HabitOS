"use client";

import { create } from "zustand";
import { nanoid } from "nanoid";
import { db, isBrowser } from "./db";
import { todayIso } from "./date";
import {
  type Entry,
  type Profile,
  type Settings,
  type Tracker,
  type TrackerCategory,
  type TrackerType,
  SettingsSchema,
} from "./schemas";

/* =========================================================
   Global UI/state store. Data lives in Dexie; this store
   exposes selectors and write helpers wired through Dexie.
   ========================================================= */

type Status = "idle" | "loading" | "ready";

interface State {
  status: Status;
  profile: Profile | null;
  settings: Settings;
  trackers: Tracker[];
  entries: Entry[];

  bootstrap: () => Promise<void>;

  // Profile
  saveProfile: (patch: Partial<Profile>) => Promise<void>;

  // Settings
  saveSettings: (patch: Partial<Settings>) => Promise<void>;

  // Trackers
  createTracker: (
    input: Omit<Tracker, "id" | "createdAt" | "updatedAt" | "order" | "archived"> & {
      archived?: boolean;
    }
  ) => Promise<Tracker>;
  updateTracker: (id: string, patch: Partial<Tracker>) => Promise<void>;
  removeTracker: (id: string) => Promise<void>;

  // Entries
  logEntry: (
    input: Omit<Entry, "id" | "createdAt"> & { id?: string }
  ) => Promise<Entry>;
  toggleHabit: (trackerId: string, date?: string) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;

  // Bulk
  resetAll: () => Promise<void>;
}

const DEFAULT_SETTINGS: Settings = SettingsSchema.parse({ id: "default" });

export const useAppStore = create<State>((set, get) => ({
  status: "idle",
  profile: null,
  settings: DEFAULT_SETTINGS,
  trackers: [],
  entries: [],

  async bootstrap() {
    if (!isBrowser()) return;
    set({ status: "loading" });
    const [profile, settingsRow, trackers, entries] = await Promise.all([
      db.profile.get("me"),
      db.settings.get("default"),
      db.trackers.orderBy("order").toArray(),
      db.entries.toArray(),
    ]);
    set({
      profile: profile ?? null,
      settings: settingsRow ?? DEFAULT_SETTINGS,
      trackers,
      entries,
      status: "ready",
    });
  },

  async saveProfile(patch) {
    const current = get().profile ?? { id: "me" as const };
    const next = { ...current, ...patch, id: "me" as const };
    await db.profile.put(next);
    set({ profile: next });
  },

  async saveSettings(patch) {
    const next = { ...get().settings, ...patch, id: "default" as const };
    await db.settings.put(next);
    set({ settings: next });
  },

  async createTracker(input) {
    const now = Date.now();
    const tracker: Tracker = {
      id: nanoid(10),
      order: get().trackers.length,
      archived: input.archived ?? false,
      createdAt: now,
      updatedAt: now,
      ...input,
    };
    await db.trackers.put(tracker);
    set({ trackers: [...get().trackers, tracker] });
    return tracker;
  },

  async updateTracker(id, patch) {
    const tr = get().trackers.find((t) => t.id === id);
    if (!tr) return;
    const next = { ...tr, ...patch, updatedAt: Date.now() };
    await db.trackers.put(next);
    set({
      trackers: get().trackers.map((t) => (t.id === id ? next : t)),
    });
  },

  async removeTracker(id) {
    await db.transaction("rw", db.trackers, db.entries, async () => {
      await db.trackers.delete(id);
      await db.entries.where("trackerId").equals(id).delete();
    });
    set({
      trackers: get().trackers.filter((t) => t.id !== id),
      entries: get().entries.filter((e) => e.trackerId !== id),
    });
  },

  async logEntry(input) {
    const entry: Entry = {
      id: input.id ?? nanoid(10),
      createdAt: Date.now(),
      ...input,
    };
    await db.entries.put(entry);
    set({
      entries: [...get().entries.filter((e) => e.id !== entry.id), entry],
    });
    return entry;
  },

  async toggleHabit(trackerId, date) {
    const d = date ?? todayIso();
    const existing = get().entries.find(
      (e) => e.trackerId === trackerId && e.date === d
    );
    if (existing) {
      await db.entries.delete(existing.id);
      set({ entries: get().entries.filter((e) => e.id !== existing.id) });
    } else {
      await get().logEntry({ trackerId, date: d, done: true });
    }
  },

  async removeEntry(id) {
    await db.entries.delete(id);
    set({ entries: get().entries.filter((e) => e.id !== id) });
  },

  async resetAll() {
    await Promise.all([
      db.trackers.clear(),
      db.entries.clear(),
      db.profile.clear(),
      db.settings.clear(),
    ]);
    set({
      profile: null,
      settings: DEFAULT_SETTINGS,
      trackers: [],
      entries: [],
    });
  },
}));

/* ---------- selectors ---------- */

export function selectTrackersByCategory(category: TrackerCategory) {
  return useAppStore((s) => s.trackers.filter((t) => t.category === category && !t.archived));
}

export function selectTrackersByType(type: TrackerType) {
  return useAppStore((s) => s.trackers.filter((t) => t.type === type && !t.archived));
}
