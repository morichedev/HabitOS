"use client";

import * as React from "react";
import { Plus, Trash2, X } from "lucide-react";
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
import { useAppStore } from "@/lib/store";
import { todayIso } from "@/lib/date";
import type { ExerciseEntry } from "@/lib/schemas";

interface DraftExercise {
  exerciseName: string;
  sets: { reps: number; weight: number }[];
}

const SUGGESTIONS = [
  "Bench Press",
  "Squat",
  "Deadlift",
  "Overhead Press",
  "Pull Up",
  "Row",
  "Lat Pulldown",
  "Leg Press",
  "Hip Thrust",
  "Bicep Curl",
];

export function WorkoutDialog({
  open,
  onOpenChange,
  trackerId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  trackerId: string | undefined;
}) {
  const logEntry = useAppStore((s) => s.logEntry);
  const [exercises, setExercises] = React.useState<DraftExercise[]>([
    { exerciseName: "", sets: [{ reps: 8, weight: 0 }] },
  ]);

  React.useEffect(() => {
    if (open) {
      setExercises([{ exerciseName: "", sets: [{ reps: 8, weight: 0 }] }]);
    }
  }, [open]);

  function addExercise() {
    setExercises((prev) => [...prev, { exerciseName: "", sets: [{ reps: 8, weight: 0 }] }]);
  }

  function removeExercise(i: number) {
    setExercises((prev) => prev.filter((_, idx) => idx !== i));
  }

  function addSet(i: number) {
    setExercises((prev) =>
      prev.map((ex, idx) =>
        idx === i
          ? {
              ...ex,
              sets: [
                ...ex.sets,
                {
                  reps: ex.sets.at(-1)?.reps ?? 8,
                  weight: ex.sets.at(-1)?.weight ?? 0,
                },
              ],
            }
          : ex
      )
    );
  }

  function removeSet(exi: number, seti: number) {
    setExercises((prev) =>
      prev.map((ex, idx) =>
        idx === exi ? { ...ex, sets: ex.sets.filter((_, i) => i !== seti) } : ex
      )
    );
  }

  function updateSet(exi: number, seti: number, patch: Partial<{ reps: number; weight: number }>) {
    setExercises((prev) =>
      prev.map((ex, idx) =>
        idx === exi
          ? { ...ex, sets: ex.sets.map((s, i) => (i === seti ? { ...s, ...patch } : s)) }
          : ex
      )
    );
  }

  function updateName(i: number, name: string) {
    setExercises((prev) => prev.map((ex, idx) => (idx === i ? { ...ex, exerciseName: name } : ex)));
  }

  async function submit() {
    if (!trackerId) return;
    const clean: ExerciseEntry[] = exercises
      .filter((ex) => ex.exerciseName.trim() && ex.sets.length > 0)
      .map((ex) => ({
        exerciseName: ex.exerciseName.trim(),
        sets: ex.sets.filter((s) => s.reps > 0 || s.weight > 0),
      }))
      .filter((ex) => ex.sets.length > 0);

    if (clean.length === 0) {
      onOpenChange(false);
      return;
    }
    await logEntry({ trackerId, date: todayIso(), exercises: clean });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log workout</DialogTitle>
          <DialogDescription>
            Add exercises and sets. We'll calculate volume and detect PRs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {exercises.map((ex, exi) => (
            <div
              key={exi}
              className="rounded-xl border border-border/60 bg-card/40 p-4 space-y-3"
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <Label>Exercise</Label>
                  <Input
                    list={`ex-suggestions-${exi}`}
                    value={ex.exerciseName}
                    onChange={(e) => updateName(exi, e.target.value)}
                    placeholder="e.g. Bench Press"
                  />
                  <datalist id={`ex-suggestions-${exi}`}>
                    {SUGGESTIONS.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>
                {exercises.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExercise(exi)}
                    className="text-muted-foreground hover:text-destructive mt-7"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 text-xs uppercase tracking-wider text-muted-foreground px-1">
                  <div>Set</div>
                  <div>Reps</div>
                  <div>Weight (kg)</div>
                  <div></div>
                </div>
                {ex.sets.map((s, seti) => (
                  <div key={seti} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                    <div className="text-sm font-mono text-muted-foreground pl-1">#{seti + 1}</div>
                    <Input
                      type="number"
                      min={0}
                      value={s.reps}
                      onChange={(e) => updateSet(exi, seti, { reps: Number(e.target.value) })}
                      className="h-9"
                    />
                    <Input
                      type="number"
                      min={0}
                      step="0.5"
                      value={s.weight}
                      onChange={(e) => updateSet(exi, seti, { weight: Number(e.target.value) })}
                      className="h-9"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSet(exi, seti)}
                      disabled={ex.sets.length <= 1}
                      className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addSet(exi)}
                  className="w-full"
                >
                  <Plus className="h-3.5 w-3.5" /> Add set
                </Button>
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={addExercise} className="w-full">
            <Plus className="h-4 w-4" /> Add exercise
          </Button>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="gradient" onClick={submit}>
            Save workout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
