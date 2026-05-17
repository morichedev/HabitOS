"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/70 backdrop-blur-xl p-10 sm:p-14 text-center shadow-elevated"
        >
          <div className="absolute inset-0 -z-10 bg-aurora opacity-25 blur-3xl" />
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-balance">
            Your future self
            <br className="hidden sm:block" />
            is already
            <span className="gradient-text"> tracking</span>.
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Start now. No signup, no friction, no ads — ever.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="xl" variant="gradient" className="group">
              <Link href="/onboarding">
                Get started — it's free
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/dashboard">Explore the dashboard</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
