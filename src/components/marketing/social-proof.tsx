"use client";

import { motion } from "framer-motion";

const logos = ["Acme", "Linear", "Notion", "Vercel", "Figma", "Apple"];

export function SocialProof() {
  return (
    <section className="border-y border-border/40 bg-card/30 backdrop-blur-md py-10">
      <div className="container">
        <p className="text-center text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Inspired by the products you love most
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-muted-foreground/70"
        >
          {logos.map((l) => (
            <span
              key={l}
              className="font-display text-lg sm:text-xl font-semibold tracking-tight"
            >
              {l}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
