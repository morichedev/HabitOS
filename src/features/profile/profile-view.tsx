"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppStore } from "@/lib/store";
import { computeTarget, computeTdee } from "@/lib/schemas";
import { useToast } from "@/components/ui/use-toast";

export function ProfileView() {
  const profile = useAppStore((s) => s.profile);
  const saveProfile = useAppStore((s) => s.saveProfile);
  const { toast } = useToast();

  const [draft, setDraft] = React.useState(() => ({
    name: profile?.name ?? "",
    age: profile?.age ?? 28,
    sex: (profile?.sex ?? "male") as "male" | "female" | "other",
    heightCm: profile?.heightCm ?? 178,
    weightKg: profile?.weightKg ?? 75,
    activity: (profile?.activity ?? "moderate") as
      | "sedentary"
      | "light"
      | "moderate"
      | "active"
      | "athlete",
    goal: (profile?.goal ?? "maintain") as "lose" | "maintain" | "gain" | "recomp",
  }));

  React.useEffect(() => {
    if (profile) {
      setDraft({
        name: profile.name ?? "",
        age: profile.age ?? 28,
        sex: (profile.sex ?? "male") as "male" | "female" | "other",
        heightCm: profile.heightCm ?? 178,
        weightKg: profile.weightKg ?? 75,
        activity: (profile.activity ?? "moderate") as never,
        goal: (profile.goal ?? "maintain") as never,
      });
    }
  }, [profile]);

  const tdee = computeTdee({
    weightKg: draft.weightKg,
    heightCm: draft.heightCm,
    age: draft.age,
    sex: draft.sex,
    activity: draft.activity,
  });
  const target = computeTarget(tdee, draft.goal);

  async function save() {
    await saveProfile({ ...draft, tdee, targetCalories: target });
    toast({ title: "Profile saved", description: "Your targets have been updated." });
  }

  return (
    <div className="container py-8 sm:py-10 max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg">
            {(draft.name?.[0] ?? "U").toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            {draft.name || "Your profile"}
          </h1>
          <p className="text-sm text-muted-foreground">
            All data is local. Used for personal targets.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal info</CardTitle>
          <CardDescription>Used to calculate your TDEE and calorie target.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Name">
            <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Age">
              <Input
                type="number"
                value={draft.age}
                onChange={(e) => setDraft({ ...draft, age: Number(e.target.value) })}
              />
            </Field>
            <Field label="Sex">
              <Select value={draft.sex} onValueChange={(v) => setDraft({ ...draft, sex: v as never })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Height (cm)">
              <Input
                type="number"
                value={draft.heightCm}
                onChange={(e) => setDraft({ ...draft, heightCm: Number(e.target.value) })}
              />
            </Field>
            <Field label="Weight (kg)">
              <Input
                type="number"
                step="0.1"
                value={draft.weightKg}
                onChange={(e) => setDraft({ ...draft, weightKg: Number(e.target.value) })}
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Goals</CardTitle>
          <CardDescription>How active are you, and what are you working toward?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Activity level">
            <Select value={draft.activity} onValueChange={(v) => setDraft({ ...draft, activity: v as never })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="athlete">Athlete</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Goal">
            <Select value={draft.goal} onValueChange={(v) => setDraft({ ...draft, goal: v as never })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="lose">Lose fat</SelectItem>
                <SelectItem value="maintain">Maintain</SelectItem>
                <SelectItem value="gain">Build muscle</SelectItem>
                <SelectItem value="recomp">Recomp</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <motion.div layout className="grid grid-cols-2 gap-3 mt-4">
            <Box label="TDEE" value={`${tdee.toLocaleString()} kcal`} />
            <Box label="Target" value={`${target.toLocaleString()} kcal`} highlight />
          </motion.div>

          <Button variant="gradient" onClick={save} className="w-full sm:w-auto">
            Save changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Box({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-xl font-bold ${highlight ? "gradient-text" : ""}`}>
        {value}
      </div>
    </div>
  );
}
