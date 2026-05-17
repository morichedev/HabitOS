"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "#features", label: "Features" },
  { href: "#trackers", label: "Trackers" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-40"
    >
      <div className="container">
        <div
          className={`mt-3 flex items-center justify-between rounded-2xl border px-3 py-2 transition-all ${
            scrolled
              ? "border-border/70 bg-background/70 backdrop-blur-xl shadow-elevated"
              : "border-transparent bg-transparent"
          }`}
        >
          <Link href="/" className="flex items-center gap-2 px-2">
            <div className="relative h-7 w-7 rounded-lg gradient-brand flex items-center justify-center shadow-glow">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-bold tracking-tight">HabitOS</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild variant="gradient" size="sm">
              <Link href="/onboarding">Get started</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
