"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Brain,
  Dumbbell,
  Flame,
  Layers,
  Lock,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Layers,
    title: "Build your own systems",
    desc: "Create any tracker you can imagine — booleans, counts, durations, weights, exercises or freeform metrics. No rigid templates.",
  },
  {
    icon: Dumbbell,
    title: "Gym tracking that respects your time",
    desc: "Log sets, reps, weight and RPE. See PRs, weekly volume and progressive overload at a glance.",
  },
  {
    icon: Flame,
    title: "Streaks that feel rewarding",
    desc: "Beautiful streaks, heatmaps and progress rings. Motivation without manipulation.",
  },
  {
    icon: BarChart3,
    title: "Real analytics",
    desc: "Recharts-powered dashboards with weekly, monthly and lifetime views. Spot trends in seconds.",
  },
  {
    icon: Brain,
    title: "Insights, not just numbers",
    desc: "Automatic patterns — best day of the week, momentum shifts, plateaus and wins.",
  },
  {
    icon: Activity,
    title: "Calorie & body composition",
    desc: "TDEE auto-calculated from your profile. Track weight, protein and energy intake.",
  },
  {
    icon: Lock,
    title: "Yours by default",
    desc: "100% offline-first via IndexedDB. Sign up only if you want sync across devices.",
  },
  {
    icon: Smartphone,
    title: "Feels native on mobile",
    desc: "PWA-ready with offline support, install on home screen, smooth as a native app.",
  },
  {
    icon: Sparkles,
    title: "Premium by design",
    desc: "Crafted with the polish you'd expect from Linear, Notion and Apple — without the bloat.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="container">
        <SectionHeader
          eyebrow="Why HabitOS"
          title="Everything you need to track. Nothing you don't."
          subtitle="A modular foundation that adapts to your life — not the other way around."
        />

        <div className="mt-14 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="group h-full p-6 hover:shadow-glow">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary mb-4 transition-transform group-hover:scale-110">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      {eyebrow && (
        <div className={`inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-primary backdrop-blur ${align === "center" ? "" : ""}`}>
          {eyebrow}
        </div>
      )}
      <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-muted-foreground text-pretty">{subtitle}</p>
      )}
    </div>
  );
}
