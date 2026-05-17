"use client";

import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { generateInsights } from "@/lib/analytics";
import { motion } from "framer-motion";

export function InsightsWidget() {
  const trackers = useAppStore((s) => s.trackers);
  const entries = useAppStore((s) => s.entries);
  const insights = generateInsights(trackers, entries);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" /> Insights
        </CardTitle>
        <CardDescription>Patterns we noticed in your data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="rounded-xl border border-border/60 bg-muted/30 p-3 text-sm leading-relaxed"
          >
            <span className="gradient-text font-medium">✦</span> {line}
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
