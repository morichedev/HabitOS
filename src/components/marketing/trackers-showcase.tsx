"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  Dumbbell,
  Flower2,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { SectionHeader } from "./features";

const items = [
  {
    icon: Sparkles,
    label: "Daily habits",
    examples: ["Wake up early", "2L water", "8k steps", "Read 20 min"],
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    icon: Dumbbell,
    label: "Gym & strength",
    examples: ["Workout log", "PRs", "Weekly volume", "Body weight"],
    color: "from-rose-500 to-orange-500",
  },
  {
    icon: GraduationCap,
    label: "Study",
    examples: ["Deep work", "Problems solved", "Lectures watched"],
    color: "from-sky-500 to-cyan-400",
  },
  {
    icon: Brain,
    label: "Productivity",
    examples: ["Focus blocks", "Tasks shipped", "Inbox zero"],
    color: "from-emerald-500 to-lime-400",
  },
  {
    icon: BookOpen,
    label: "Reading",
    examples: ["Pages read", "Books finished", "Reading streak"],
    color: "from-amber-500 to-yellow-400",
  },
  {
    icon: Flower2,
    label: "Mindfulness",
    examples: ["Meditation", "Gratitude", "Mood"],
    color: "from-pink-500 to-rose-400",
  },
];

export function TrackersShowcase() {
  return (
    <section id="trackers" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[400px] bg-aurora opacity-20 blur-[100px]" />
      <div className="container">
        <SectionHeader
          eyebrow="Templates"
          title="Start in seconds. Customize forever."
          subtitle="Pick a template to bootstrap your dashboard, then make it yours."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="card-premium p-6 relative overflow-hidden"
            >
              <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${it.color} opacity-20 blur-2xl`} />
              <div className="flex items-center gap-3">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${it.color} text-white shadow-glow`}>
                  <it.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-base font-semibold tracking-tight">{it.label}</div>
                  <div className="text-xs text-muted-foreground">Template · ready to use</div>
                </div>
              </div>
              <ul className="mt-5 space-y-2 text-sm">
                {it.examples.map((ex) => (
                  <li key={ex} className="flex items-center gap-2 text-foreground/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {ex}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
