"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./features";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to track your life locally.",
    cta: "Start tracking",
    href: "/onboarding",
    highlight: false,
    features: [
      "Unlimited trackers",
      "All templates",
      "Offline-first (IndexedDB)",
      "Full analytics & heatmaps",
      "PWA install",
      "Dark & light themes",
    ],
  },
  {
    name: "Pro",
    price: "$5",
    period: "/month",
    description: "Sync across devices and unlock advanced insights.",
    cta: "Coming soon",
    href: "#",
    highlight: true,
    features: [
      "Everything in Free",
      "Cloud sync across devices",
      "Smart weekly insights",
      "Export to CSV / JSON",
      "Priority support",
      "Early access to new modules",
    ],
  },
  {
    name: "Team",
    price: "$12",
    period: "/seat/mo",
    description: "Shared accountability for coaches, teams and friends.",
    cta: "Talk to us",
    href: "mailto:hello@habitos.app",
    highlight: false,
    features: [
      "Everything in Pro",
      "Shared dashboards",
      "Coach view & comments",
      "SSO & SAML (Enterprise)",
      "Role-based access",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="container">
        <SectionHeader
          eyebrow="Pricing"
          title="Free forever. Premium when you want more."
          subtitle="The core experience is free and unlimited. Pro and Team are optional upgrades."
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-3 max-w-5xl mx-auto">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.05 }}
              className={`relative rounded-2xl p-6 border ${
                t.highlight
                  ? "border-primary/40 bg-card shadow-glow ring-1 ring-primary/30"
                  : "border-border/70 bg-card/80 backdrop-blur"
              }`}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-6 rounded-full gradient-brand px-3 py-1 text-xs font-semibold text-white shadow-md">
                  Most loved
                </div>
              )}
              <div className="font-display text-lg font-semibold">{t.name}</div>
              <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold">{t.price}</span>
                <span className="text-sm text-muted-foreground">{t.period}</span>
              </div>
              <Button
                asChild
                variant={t.highlight ? "gradient" : "outline"}
                className="mt-5 w-full"
                size="lg"
              >
                <Link href={t.href}>{t.cta}</Link>
              </Button>
              <ul className="mt-6 space-y-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground/85">{f}</span>
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
