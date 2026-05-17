import { z } from "zod";

/* =========================================================
   HabitOS — Dynamic Tracker System (Zod)
   ========================================================= */

export const TrackerCategoryEnum = z.enum([
  "habit",
  "productivity",
  "study",
  "gym",
  "nutrition",
  "reading",
  "mindfulness",
  "goal",
  "todo",
  "metric",
  "custom",
]);
export type TrackerCategory = z.infer<typeof TrackerCategoryEnum>;

export const TrackerTypeEnum = z.enum([
  "boolean", // done / not done
  "count", // numeric count (e.g. 30 pushups, 8 glasses water)
  "duration", // minutes
  "scale", // 1-10 mood
  "weight", // kg/lb
  "calories",
  "exercise", // structured gym data
  "free", // freeform metric
]);
export type TrackerType = z.infer<typeof TrackerTypeEnum>;

export const FrequencyEnum = z.enum(["daily", "weekly", "monthly", "custom"]);
export type Frequency = z.infer<typeof FrequencyEnum>;

export const TrackerSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(80),
  description: z.string().max(280).optional(),
  category: TrackerCategoryEnum,
  type: TrackerTypeEnum,
  icon: z.string().default("Sparkles"),
  color: z.string().default("#7C5CFF"),
  unit: z.string().optional(), // "min", "kg", "kcal", "pages"
  frequency: FrequencyEnum.default("daily"),
  targetMin: z.number().optional(),
  targetMax: z.number().optional(),
  // hide from dashboard but keep history
  archived: z.boolean().default(false),
  createdAt: z.number(),
  updatedAt: z.number(),
  order: z.number().default(0),
});
export type Tracker = z.infer<typeof TrackerSchema>;

/* ---------------- Entries ---------------- */

export const ExerciseSetSchema = z.object({
  reps: z.number().int().nonnegative(),
  weight: z.number().nonnegative(),
  rpe: z.number().min(1).max(10).optional(),
});
export type ExerciseSet = z.infer<typeof ExerciseSetSchema>;

export const ExerciseEntrySchema = z.object({
  exerciseName: z.string(),
  sets: z.array(ExerciseSetSchema),
  notes: z.string().optional(),
});
export type ExerciseEntry = z.infer<typeof ExerciseEntrySchema>;

export const EntrySchema = z.object({
  id: z.string(),
  trackerId: z.string(),
  // ISO date YYYY-MM-DD (local) — one logical day
  date: z.string(),
  // generic numeric value
  value: z.number().optional(),
  // boolean tick
  done: z.boolean().optional(),
  note: z.string().max(500).optional(),
  // for exercise type
  exercises: z.array(ExerciseEntrySchema).optional(),
  createdAt: z.number(),
});
export type Entry = z.infer<typeof EntrySchema>;

/* ---------------- Profile ---------------- */

export const SexEnum = z.enum(["male", "female", "other"]);
export const ActivityLevelEnum = z.enum([
  "sedentary",
  "light",
  "moderate",
  "active",
  "athlete",
]);
export const GoalEnum = z.enum(["lose", "maintain", "gain", "recomp"]);

export const ProfileSchema = z.object({
  id: z.literal("me").default("me"),
  name: z.string().max(60).optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional(),
  age: z.number().int().min(8).max(120).optional(),
  sex: SexEnum.optional(),
  heightCm: z.number().min(80).max(260).optional(),
  weightKg: z.number().min(20).max(400).optional(),
  activity: ActivityLevelEnum.optional(),
  goal: GoalEnum.optional(),
  tdee: z.number().optional(),
  targetCalories: z.number().optional(),
  onboardedAt: z.number().optional(),
});
export type Profile = z.infer<typeof ProfileSchema>;

/* ---------------- Settings ---------------- */

export const SettingsSchema = z.object({
  id: z.literal("default").default("default"),
  weekStart: z.enum(["mon", "sun"]).default("mon"),
  unitSystem: z.enum(["metric", "imperial"]).default("metric"),
  reduceMotion: z.boolean().default(false),
  hiddenWidgets: z.array(z.string()).default([]),
  widgetOrder: z.array(z.string()).default([]),
});
export type Settings = z.infer<typeof SettingsSchema>;

/* ---------------- TDEE helpers ---------------- */

export function bmrMifflin(p: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: "male" | "female" | "other";
}) {
  const base = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age;
  if (p.sex === "male") return base + 5;
  if (p.sex === "female") return base - 161;
  // "other" — average
  return base - 78;
}

const ACTIVITY_FACTOR: Record<z.infer<typeof ActivityLevelEnum>, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

const GOAL_DELTA: Record<z.infer<typeof GoalEnum>, number> = {
  lose: -500,
  maintain: 0,
  gain: 400,
  recomp: -200,
};

export function computeTdee(p: Required<Pick<Profile, "weightKg" | "heightCm" | "age" | "sex" | "activity">>) {
  const bmr = bmrMifflin({
    weightKg: p.weightKg,
    heightCm: p.heightCm,
    age: p.age,
    sex: p.sex,
  });
  return Math.round(bmr * ACTIVITY_FACTOR[p.activity]);
}

export function computeTarget(tdee: number, goal: z.infer<typeof GoalEnum>) {
  return Math.max(1200, Math.round(tdee + GOAL_DELTA[goal]));
}
