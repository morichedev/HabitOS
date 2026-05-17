"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="container py-20 text-center">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mx-auto mb-6 h-20 w-20 rounded-full gradient-brand flex items-center justify-center shadow-glow"
      >
        <Sparkles className="h-8 w-8 text-white" />
      </motion.div>
      <h1 className="font-display text-3xl font-bold tracking-tight">
        Let's set up your trackers
      </h1>
      <p className="mt-2 text-muted-foreground max-w-md mx-auto">
        Run the quick onboarding to pick templates and start tracking what matters.
      </p>
      <Button asChild variant="gradient" size="lg" className="mt-6">
        <Link href="/onboarding">
          Start onboarding <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
