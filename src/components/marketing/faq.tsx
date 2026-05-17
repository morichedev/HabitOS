"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionHeader } from "./features";

const faqs = [
  {
    q: "Do I need to create an account?",
    a: "No. HabitOS is 100% offline-first. Your data lives in your browser via IndexedDB. Creating an account is optional and only enables cloud sync.",
  },
  {
    q: "Can I track custom things?",
    a: "Yes. Every tracker is a typed module — boolean, count, duration, weight, scale, calories, exercise or freeform metric. Build whatever system you need.",
  },
  {
    q: "Does it work offline?",
    a: "Always. The app is a PWA you can install on your phone or desktop. Logging, charts and analytics all work without a network connection.",
  },
  {
    q: "How does the calorie / TDEE calculator work?",
    a: "We use the Mifflin-St Jeor equation with your age, sex, height, weight and activity level. Your goal (lose/maintain/gain/recomp) adjusts the daily target.",
  },
  {
    q: "Can I export my data?",
    a: "Yes — you own your data. Export to JSON anytime from Settings. Pro adds CSV export for spreadsheet analysis.",
  },
  {
    q: "Is HabitOS open source?",
    a: "The core experience is built to be transparent. Star us on GitHub for updates as we open more pieces over time.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="container max-w-3xl">
        <SectionHeader
          eyebrow="FAQ"
          title="Questions, answered."
          subtitle="Can't find what you're looking for? Reach out — we read every message."
        />
        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <FaqItem question={f.q} answer={f.a} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="card-premium overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-medium">{question}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}
