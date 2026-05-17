"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type ProfileForm = {
  name: string;
  age: number;
  sex: "male" | "female" | "other";
  heightCm: number;
  weightKg: number;
};

export function StepProfile({
  value,
  onChange,
}: {
  value: ProfileForm;
  onChange: (v: ProfileForm) => void;
}) {
  function update<K extends keyof ProfileForm>(k: K, v: ProfileForm[K]) {
    onChange({ ...value, [k]: v });
  }

  return (
    <div>
      <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Tell us about you</h2>
      <p className="mt-1 text-muted-foreground">
        Used for personal targets like calories. Stays on your device.
      </p>

      <div className="mt-8 grid gap-5">
        <Field label="What should we call you?">
          <Input
            placeholder="Your name"
            value={value.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </Field>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Age">
            <Input
              type="number"
              min={8}
              max={120}
              value={value.age}
              onChange={(e) => update("age", Number(e.target.value))}
            />
          </Field>
          <Field label="Sex">
            <Select value={value.sex} onValueChange={(v) => update("sex", v as ProfileForm["sex"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Height (cm)">
            <Input
              type="number"
              min={80}
              max={260}
              value={value.heightCm}
              onChange={(e) => update("heightCm", Number(e.target.value))}
            />
          </Field>
          <Field label="Weight (kg)">
            <Input
              type="number"
              min={20}
              max={400}
              step="0.1"
              value={value.weightKg}
              onChange={(e) => update("weightKg", Number(e.target.value))}
            />
          </Field>
        </div>
      </div>
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
