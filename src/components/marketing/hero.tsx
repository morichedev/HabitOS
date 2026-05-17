"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroOrb = dynamic(() => import("@/components/three/hero-orb").then((m) => m.HeroOrb), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-aurora opacity-40 blur-3xl" />,
});

export function Hero() {
  return (
    <section className="relative isolate pt-32 pb-24 sm:pt-40 overflow-hidden">
      {/* background layers */}
      <div className="absolute inset-0 -z-10 bg-grid opacity-[0.08] mask-fade-b" />
      <div className="absolute left-1/2 top-0 -z-10 h-[800px] w-[1200px] -translate-x-1/2 bg-aurora opacity-30 blur-[120px] rounded-full" />

      <div className="container">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              v1.0 — offline-first, open & yours
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.02]"
            >
              The <span className="gradient-text">operating system</span> for your habits.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-xl text-lg sm:text-xl text-muted-foreground text-pretty"
            >
              Track anything that matters — habits, workouts, study, calories, your own metrics.
              Beautiful dashboards. Real insights. Works offline. Yours forever.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Button asChild size="xl" variant="gradient" className="group">
                <Link href="/onboarding">
                  Start tracking — it's free
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href="/dashboard">
                  <Zap className="mr-1 h-4 w-4" /> Try the demo
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-8 flex items-center gap-6 text-xs text-muted-foreground"
            >
              <Stat label="No account required" value="100%" />
              <div className="h-8 w-px bg-border" />
              <Stat label="Works offline" value="∞" />
              <div className="h-8 w-px bg-border" />
              <Stat label="Trackers" value="Unlimited" />
            </motion.div>
          </div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-square w-full max-w-[560px] mx-auto"
          >
            <div className="absolute inset-0 rounded-full bg-aurora opacity-50 blur-2xl" />
            <HeroOrb className="absolute inset-0" />
            {/* floating cards */}
            <FloatingCard
              className="absolute -left-2 sm:-left-8 top-10 w-48"
              delay={0.6}
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                Streak
              </div>
              <div className="mt-1 font-display text-2xl font-semibold">21 days 🔥</div>
              <div className="mt-2 flex gap-0.5">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-6 w-1.5 rounded-sm"
                    style={{
                      background: `hsl(${250 - i * 5}, 90%, ${60 - i}%)`,
                    }}
                  />
                ))}
              </div>
            </FloatingCard>
            <FloatingCard
              className="absolute -right-2 sm:-right-6 bottom-12 w-56"
              delay={0.8}
            >
              <div className="text-xs text-muted-foreground">Today</div>
              <div className="mt-1 font-display text-lg font-semibold">5 of 7 habits</div>
              <div className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full gradient-brand" style={{ width: "71%" }} />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">+14% vs last week</div>
            </FloatingCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display font-semibold text-foreground">{value}</div>
      <div>{label}</div>
    </div>
  );
}

function FloatingCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`glass-strong rounded-2xl p-4 shadow-elevated ${className}`}
    >
      {children}
    </motion.div>
  );
}
