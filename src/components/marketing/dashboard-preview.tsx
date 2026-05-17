"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./features";

export function DashboardPreview() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="container">
        <SectionHeader
          eyebrow="Dashboard"
          title="A dashboard that actually feels good to open."
          subtitle="Streaks, heatmaps, gradients and motion — all designed to make tracking a delight."
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-14 mx-auto max-w-6xl"
        >
          <div className="absolute -inset-x-10 -inset-y-6 bg-aurora opacity-25 blur-3xl rounded-[40px] -z-10" />
          <div className="card-premium overflow-hidden p-2 sm:p-3 shadow-elevated">
            <MockDashboard />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MockDashboard() {
  return (
    <div className="rounded-2xl border border-border/60 bg-background overflow-hidden">
      {/* Topbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <div className="text-xs text-muted-foreground font-mono">habitos.app/dashboard</div>
        <div className="text-xs text-muted-foreground">Good morning, Alex</div>
      </div>

      <div className="grid lg:grid-cols-[1fr_2fr]">
        {/* Sidebar */}
        <div className="hidden lg:block border-r border-border/60 p-4 space-y-2">
          {["Today", "Habits", "Gym", "Study", "Nutrition", "Goals", "Analytics", "Calendar"].map(
            (l, i) => (
              <div
                key={l}
                className={`px-3 py-2 rounded-lg text-sm flex items-center justify-between ${
                  i === 0 ? "bg-primary/15 text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                <span>{l}</span>
                {i === 0 && <span className="text-[10px] bg-primary/20 px-1.5 py-0.5 rounded">12</span>}
              </div>
            )
          )}
        </div>

        {/* Main */}
        <div className="p-5 grid gap-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { k: "Streak", v: "21d", c: "from-violet-500 to-fuchsia-500" },
              { k: "Today", v: "5/7", c: "from-emerald-500 to-teal-500" },
              { k: "Volume", v: "12.4t", c: "from-rose-500 to-orange-400" },
              { k: "Calories", v: "1,840", c: "from-sky-500 to-cyan-400" },
            ].map((s) => (
              <div key={s.k} className="rounded-xl border border-border/60 bg-card/60 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.k}</div>
                <div
                  className={`mt-1 font-display text-xl font-semibold bg-gradient-to-br ${s.c} bg-clip-text text-transparent`}
                >
                  {s.v}
                </div>
              </div>
            ))}
          </div>

          {/* Heatmap */}
          <div className="rounded-xl border border-border/60 bg-card/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium">Habits — last 91 days</div>
              <div className="text-xs text-muted-foreground">86% consistency</div>
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-1">
              {Array.from({ length: 91 }).map((_, i) => {
                const v = Math.random();
                return (
                  <div
                    key={i}
                    className="h-3 w-3 rounded-sm"
                    style={{
                      background: v < 0.2 ? "hsl(var(--muted))" : `hsl(256, 90%, ${30 + v * 40}%)`,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Chart placeholder */}
          <div className="rounded-xl border border-border/60 bg-card/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium">Weekly progress</div>
              <div className="text-xs text-muted-foreground">+14% vs last week</div>
            </div>
            <div className="h-32 flex items-end gap-2">
              {[0.4, 0.55, 0.7, 0.5, 0.85, 0.65, 0.9].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-md gradient-brand"
                    style={{ height: `${v * 100}%` }}
                  />
                  <div className="text-[10px] text-muted-foreground">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
