"use client";

import { computeTarget, computeTdee } from "@/lib/schemas";
import { motion } from "framer-motion";
import type { ProfileForm } from "./step-profile";

const ACTIVITIES = [
  { value: "sedentary", label: "Sedentary", hint: "Office life, little exercise" },
  { value: "light", label: "Light", hint: "1-2 days of light exercise" },
  { value: "moderate", label: "Moderate", hint: "3-5 days of training" },
  { value: "active", label: "Active", hint: "Most days, intense training" },
  { value: "athlete", label: "Athlete", hint: "2x daily / pro-level" },
] as const;

const GOALS = [
  { value: "lose", label: "Lose fat", desc: "Sustainable deficit (~500 kcal)" },
  { value: "maintain", label: "Maintain", desc: "Keep current composition" },
  { value: "gain", label: "Build muscle", desc: "Lean surplus (~400 kcal)" },
  { value: "recomp", label: "Recomp", desc: "Slight deficit, train hard" },
] as const;

type Activity = (typeof ACTIVITIES)[number]["value"];
type Goal = (typeof GOALS)[number]["value"];

export function StepGoals({
  activity,
  goal,
  onActivity,
  onGoal,
  profile,
}: {
  activity: Activity;
  goal: Goal;
  onActivity: (a: Activity) => void;
  onGoal: (g: Goal) => void;
  profile: ProfileForm;
}) {
  const tdee = computeTdee({
    weightKg: profile.weightKg,
    heightCm: profile.heightCm,
    age: profile.age,
    sex: profile.sex,
    activity,
  });
  const target = computeTarget(tdee, goal);

  return (
    <div>
      <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Your goal</h2>
      <p className="mt-1 text-muted-foreground">
        We'll auto-calculate your daily energy targets.
      </p>

      <div className="mt-8">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
          Activity level
        </div>
        <div className="grid sm:grid-cols-5 gap-2">
          {ACTIVITIES.map((a) => (
            <button
              key={a.value}
              onClick={() => onActivity(a.value)}
              className={`rounded-xl border p-3 text-left transition-all ${
                activity === a.value
                  ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                  : "border-border/70 hover:border-border bg-card/50"
              }`}
            >
              <div className="font-medium text-sm">{a.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{a.hint}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Goal</div>
        <div className="grid sm:grid-cols-2 gap-3">
          {GOALS.map((g) => (
            <button
              key={g.value}
              onClick={() => onGoal(g.value)}
              className={`rounded-xl border p-4 text-left transition-all ${
                goal === g.value
                  ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                  : "border-border/70 hover:border-border bg-card/50"
              }`}
            >
              <div className="font-display font-semibold">{g.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{g.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <motion.div
        layout
        className="mt-8 grid grid-cols-2 gap-3 card-premium p-5"
      >
        <Stat label="TDEE" value={`${tdee.toLocaleString()} kcal`} hint="Maintenance" />
        <Stat label="Target" value={`${target.toLocaleString()} kcal`} hint="Daily intake" highlight />
      </motion.div>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  highlight,
}: {
  label: string;
  value: string;
  hint: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div
        className={`mt-1 font-display text-2xl sm:text-3xl font-bold ${
          highlight ? "gradient-text" : ""
        }`}
      >
        {value}
      </div>
      <div className="text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}
