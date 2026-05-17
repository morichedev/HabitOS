"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { ACCENT_PALETTE } from "@/lib/utils";
import type {
  Tracker,
  TrackerCategory,
  TrackerType,
} from "@/lib/schemas";

const CATEGORIES: TrackerCategory[] = [
  "habit",
  "productivity",
  "study",
  "gym",
  "nutrition",
  "reading",
  "mindfulness",
  "goal",
  "metric",
  "custom",
];

const TYPES: { value: TrackerType; label: string; hint: string }[] = [
  { value: "boolean", label: "Yes / No", hint: "Daily check-in" },
  { value: "count", label: "Count", hint: "e.g. 30 pushups" },
  { value: "duration", label: "Duration", hint: "e.g. 30 minutes" },
  { value: "scale", label: "Scale 1-10", hint: "e.g. mood, energy" },
  { value: "weight", label: "Weight", hint: "kg / lb" },
  { value: "calories", label: "Calories", hint: "kcal" },
  { value: "free", label: "Free-form", hint: "Any number" },
];

export function HabitFormDialog({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: Tracker | null;
}) {
  const createTracker = useAppStore((s) => s.createTracker);
  const updateTracker = useAppStore((s) => s.updateTracker);

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState<TrackerCategory>("habit");
  const [type, setType] = React.useState<TrackerType>("boolean");
  const [color, setColor] = React.useState(ACCENT_PALETTE[0]);
  const [unit, setUnit] = React.useState("");
  const [target, setTarget] = React.useState<string>("");

  React.useEffect(() => {
    if (editing) {
      setName(editing.name);
      setDescription(editing.description ?? "");
      setCategory(editing.category);
      setType(editing.type);
      setColor(editing.color);
      setUnit(editing.unit ?? "");
      setTarget(editing.targetMin?.toString() ?? "");
    } else {
      setName("");
      setDescription("");
      setCategory("habit");
      setType("boolean");
      setColor(ACCENT_PALETTE[0]);
      setUnit("");
      setTarget("");
    }
  }, [editing, open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      category,
      type,
      icon: "Sparkles",
      color,
      unit: unit.trim() || undefined,
      frequency: "daily" as const,
      targetMin: target ? Number(target) : undefined,
    };
    if (editing) {
      await updateTracker(editing.id, payload);
    } else {
      await createTracker(payload);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit habit" : "New habit"}</DialogTitle>
          <DialogDescription>
            Anything is a habit. Name it, pick a type, ship it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Wake up early"
            />
          </div>

          <div className="space-y-2">
            <Label>Description <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why this matters to you"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as TrackerCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as TrackerType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label} — <span className="text-muted-foreground text-xs">{t.hint}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {type !== "boolean" && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Unit</Label>
                <Input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="min, kg, pages…"
                />
              </div>
              <div className="space-y-2">
                <Label>Daily target</Label>
                <Input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="e.g. 30"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {ACCENT_PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-lg transition-transform ${
                    color === c ? "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110" : ""
                  }`}
                  style={{ background: c }}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              {editing ? "Save changes" : "Create habit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
