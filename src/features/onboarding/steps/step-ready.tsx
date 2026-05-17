"use client";

import { motion } from "framer-motion";
import { computeTarget, computeTdee } from "@/lib/schemas";
import { TEMPLATES, type TemplateKey } from "@/lib/templates";
import type { ProfileForm } from "./step-profile";

export function StepReady({
  profile,
  activity,
  goal,
  selected,
}: {
  profile: ProfileForm;
  activity: "sedentary" | "light" | "moderate" | "active" | "athlete";
  goal: "lose" | "maintain" | "gain" | "recomp";
  selected: TemplateKey[];
}) {
  const tdee = computeTdee({
    weightKg: profile.weightKg,
    heightCm: profile.heightCm,
    age: profile.age,
    sex: profile.sex,
    activity,
  });
  const target = computeTarget(tdee, goal);
  const trackerCount = selected.reduce((sum, k) => sum + TEMPLATES[k].trackers.length, 0);

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-8 relative h-20 w-20"
      >
        <div className="absolute inset-0 rounded-full bg-emerald-500/40 blur-2xl" />
        <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-glow text-white text-3xl">
          ✓
        </div>
      </motion.div>
      <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-balance">
        You're all set, {profile.name || "friend"}.
      </h2>
      <p className="mt-2 text-muted-foreground">
        Your personalized dashboard is ready to open.
      </p>

      <div className="mt-8 grid sm:grid-cols-3 gap-3 max-w-md mx-auto text-left">
        <div className="card-premium p-4">
          <div className="text-xs text-muted-foreground">Target</div>
          <div className="mt-1 font-display text-xl font-bold gradient-text">{target}</div>
          <div className="text-xs text-muted-foreground">kcal / day</div>
        </div>
        <div className="card-premium p-4">
          <div className="text-xs text-muted-foreground">TDEE</div>
          <div className="mt-1 font-display text-xl font-bold">{tdee}</div>
          <div className="text-xs text-muted-foreground">maintenance</div>
        </div>
        <div className="card-premium p-4">
          <div className="text-xs text-muted-foreground">Trackers</div>
          <div className="mt-1 font-display text-xl font-bold">{trackerCount}</div>
          <div className="text-xs text-muted-foreground">ready</div>
        </div>
      </div>
    </div>
  );
}
