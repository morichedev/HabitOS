"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mb-8 relative h-24 w-24"
      >
        <div className="absolute inset-0 rounded-full gradient-brand opacity-30 blur-2xl animate-pulse" />
        <div className="relative h-24 w-24 rounded-full gradient-brand flex items-center justify-center shadow-glow">
          <span className="font-display text-3xl text-white">✦</span>
        </div>
      </motion.div>
      <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-balance">
        Welcome to <span className="gradient-text">HabitOS</span>
      </h1>
      <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-md mx-auto text-pretty">
        Let's set up a system that fits your life. This takes about 60 seconds.
      </p>
      <div className="mt-10 grid grid-cols-3 gap-3 text-left">
        {[
          { k: "01", l: "Your profile" },
          { k: "02", l: "Your goal" },
          { k: "03", l: "Pick templates" },
        ].map((it) => (
          <div key={it.k} className="card-premium p-4">
            <div className="text-xs font-mono text-muted-foreground">{it.k}</div>
            <div className="mt-1 font-display font-semibold text-sm">{it.l}</div>
          </div>
        ))}
      </div>
      <Button variant="gradient" size="lg" className="mt-8" onClick={onNext}>
        Let's go
      </Button>
    </div>
  );
}
