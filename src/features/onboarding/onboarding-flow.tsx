"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  User,
  Target,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store";
import { computeTarget, computeTdee } from "@/lib/schemas";
import { TEMPLATES, type TemplateKey } from "@/lib/templates";
import { StepWelcome } from "./steps/step-welcome";
import { StepProfile, type ProfileForm } from "./steps/step-profile";
import { StepGoals } from "./steps/step-goals";
import { StepTemplates } from "./steps/step-templates";
import { StepReady } from "./steps/step-ready";

const STEPS = [
  { id: "welcome", label: "Welcome", icon: Sparkles },
  { id: "profile", label: "Profile", icon: User },
  { id: "goals", label: "Goals", icon: Target },
  { id: "templates", label: "Templates", icon: Layers },
  { id: "ready", label: "Ready", icon: Check },
] as const;

export function OnboardingFlow() {
  const router = useRouter();
  const bootstrap = useAppStore((s) => s.bootstrap);
  const saveProfile = useAppStore((s) => s.saveProfile);
  const createTracker = useAppStore((s) => s.createTracker);
  const [step, setStep] = React.useState(0);
  const [profile, setProfile] = React.useState<ProfileForm>({
    name: "",
    age: 28,
    sex: "male",
    heightCm: 178,
    weightKg: 75,
  });
  const [activity, setActivity] = React.useState<
    "sedentary" | "light" | "moderate" | "active" | "athlete"
  >("moderate");
  const [goal, setGoal] = React.useState<"lose" | "maintain" | "gain" | "recomp">("maintain");
  const [selected, setSelected] = React.useState<TemplateKey[]>(["habits"]);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const progress = ((step + 1) / STEPS.length) * 100;
  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  async function finish() {
    setSubmitting(true);
    const tdee = computeTdee({
      weightKg: profile.weightKg,
      heightCm: profile.heightCm,
      age: profile.age,
      sex: profile.sex,
      activity,
    });
    const target = computeTarget(tdee, goal);
    await saveProfile({
      name: profile.name || undefined,
      age: profile.age,
      sex: profile.sex,
      heightCm: profile.heightCm,
      weightKg: profile.weightKg,
      activity,
      goal,
      tdee,
      targetCalories: target,
      onboardedAt: Date.now(),
    });

    // Seed selected templates
    for (const key of selected) {
      for (const t of TEMPLATES[key].trackers) {
        await createTracker(t);
      }
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid opacity-[0.06] mask-fade-b" />
      <div className="absolute left-1/2 -top-32 -translate-x-1/2 -z-10 h-[600px] w-[1000px] bg-aurora opacity-25 blur-[120px] rounded-full" />

      <div className="container max-w-2xl py-10 sm:py-16">
        {/* Progress header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg gradient-brand flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-display font-bold">HabitOS</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Step {step + 1} of {STEPS.length}
            </div>
          </div>
          <Progress value={progress} className="h-1.5" />
          <div className="mt-4 hidden sm:flex items-center justify-between text-xs">
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                className={`flex items-center gap-1.5 ${
                  i <= step ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <s.icon className="h-3.5 w-3.5" />
                {s.label}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="relative min-h-[420px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {step === 0 && <StepWelcome onNext={next} />}
              {step === 1 && (
                <StepProfile value={profile} onChange={setProfile} />
              )}
              {step === 2 && (
                <StepGoals
                  activity={activity}
                  goal={goal}
                  onActivity={setActivity}
                  onGoal={setGoal}
                  profile={profile}
                />
              )}
              {step === 3 && (
                <StepTemplates selected={selected} onChange={setSelected} />
              )}
              {step === 4 && (
                <StepReady
                  profile={profile}
                  activity={activity}
                  goal={goal}
                  selected={selected}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-10 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={prev}
            disabled={step === 0}
            className="text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button variant="gradient" size="lg" onClick={next}>
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="gradient"
              size="lg"
              onClick={finish}
              disabled={submitting}
            >
              {submitting ? "Setting up…" : "Open my dashboard"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
