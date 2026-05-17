"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Mail, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

export function AuthCard({ mode }: { mode: "login" | "signup" }) {
  const { toast } = useToast();
  const isLogin = mode === "login";

  function notReady(e?: React.FormEvent | React.MouseEvent) {
    e?.preventDefault?.();
    toast({
      title: "Cloud sync coming soon",
      description: "HabitOS works fully offline today. Sync is on the roadmap.",
    });
  }

  return (
    <div className="min-h-screen relative grid place-items-center px-4">
      <div className="absolute inset-0 -z-10 bg-grid opacity-[0.06] mask-fade-b" />
      <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[1000px] -translate-x-1/2 bg-aurora opacity-25 blur-[120px] rounded-full" />

      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto h-12 w-12 rounded-xl gradient-brand flex items-center justify-center shadow-glow">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="font-display text-2xl tracking-tight mt-3">
                {isLogin ? "Welcome back" : "Create your account"}
              </CardTitle>
              <CardDescription>
                {isLogin
                  ? "Sign in to sync HabitOS across devices."
                  : "It's free. Sync, backup and access from anywhere."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full" size="lg" onClick={() => notReady()}>
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M21.35 11.1H12v3.2h5.35c-.23 1.49-1.84 4.37-5.35 4.37-3.22 0-5.85-2.66-5.85-5.94s2.63-5.94 5.85-5.94c1.83 0 3.06.78 3.76 1.45l2.57-2.48C16.94 4.34 14.74 3.3 12 3.3 6.99 3.3 2.95 7.34 2.95 12.35S6.99 21.4 12 21.4c6.93 0 9.5-4.86 9.5-7.4 0-.49-.05-.86-.15-1.23z"
                  />
                </svg>
                Continue with Google
              </Button>

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 -top-2.5 -translate-x-1/2 bg-card px-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                  or with email
                </span>
              </div>

              <form className="space-y-3" onSubmit={notReady}>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="email" required placeholder="you@example.com" className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="password" required placeholder="••••••••" className="pl-9" />
                  </div>
                </div>
                <Button type="submit" variant="gradient" size="lg" className="w-full">
                  {isLogin ? "Sign in" : "Create account"}
                </Button>
              </form>

              <p className="text-center text-xs text-muted-foreground">
                {isLogin ? (
                  <>
                    No account?{" "}
                    <Link href="/signup" className="text-primary hover:underline">
                      Create one
                    </Link>
                  </>
                ) : (
                  <>
                    Already signed up?{" "}
                    <Link href="/login" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </>
                )}
              </p>
              <p className="text-center text-[11px] text-muted-foreground">
                You can use HabitOS without an account —{" "}
                <Link href="/dashboard" className="underline">
                  go to dashboard
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
