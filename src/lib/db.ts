import Dexie, { type EntityTable } from "dexie";
import type { Entry, Profile, Settings, Tracker } from "./schemas";

/* =========================================================
   HabitOS — Local-first persistence (IndexedDB via Dexie)
   ========================================================= */

class HabitOSDB extends Dexie {
  trackers!: EntityTable<Tracker, "id">;
  entries!: EntityTable<Entry, "id">;
  profile!: EntityTable<Profile, "id">;
  settings!: EntityTable<Settings, "id">;

  constructor() {
    super("habitos");
    this.version(1).stores({
      trackers: "id, category, type, archived, order",
      entries: "id, trackerId, date, [trackerId+date]",
      profile: "id",
      settings: "id",
    });
  }
}

export const db = new HabitOSDB();

// Helper getters — keep server bundle clean
export const isBrowser = () => typeof window !== "undefined" && typeof indexedDB !== "undefined";
