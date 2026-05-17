"use client";

import { Check } from "lucide-react";
import { TEMPLATES, type TemplateKey } from "@/lib/templates";

export function StepTemplates({
  selected,
  onChange,
}: {
  selected: TemplateKey[];
  onChange: (s: TemplateKey[]) => void;
}) {
  function toggle(k: TemplateKey) {
    onChange(selected.includes(k) ? selected.filter((x) => x !== k) : [...selected, k]);
  }
  const entries = Object.entries(TEMPLATES) as [TemplateKey, typeof TEMPLATES[TemplateKey]][];

  return (
    <div>
      <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
        Pick your starting kit
      </h2>
      <p className="mt-1 text-muted-foreground">
        Multi-select. You can edit or add more anytime.
      </p>

      <div className="mt-8 grid sm:grid-cols-2 gap-3">
        {entries.map(([key, t]) => {
          const active = selected.includes(key);
          return (
            <button
              key={key}
              onClick={() => toggle(key)}
              className={`group relative rounded-xl border p-4 text-left transition-all overflow-hidden ${
                active
                  ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                  : "border-border/70 hover:border-border bg-card/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-display font-semibold">{t.label}</div>
                <div
                  className={`h-5 w-5 rounded-md flex items-center justify-center border transition-all ${
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border/80"
                  }`}
                >
                  {active && <Check className="h-3.5 w-3.5" />}
                </div>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {t.trackers.slice(0, 3).map((tr) => (
                  <span
                    key={tr.name}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                  >
                    {tr.name}
                  </span>
                ))}
                {t.trackers.length > 3 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    +{t.trackers.length - 3} more
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
