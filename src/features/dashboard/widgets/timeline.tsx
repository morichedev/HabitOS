"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";

export function TimelineWidget() {
  const trackers = useAppStore((s) => s.trackers);
  const entries = useAppStore((s) => s.entries);
  const trackerMap = new Map(trackers.map((t) => [t.id, t]));

  const recent = [...entries]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Your latest entries.</CardDescription>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            Nothing logged yet. Log a habit or workout to see it here.
          </div>
        ) : (
          <ol className="relative space-y-3">
            <div className="absolute left-[5px] top-1 bottom-1 w-px bg-border" />
            {recent.map((e) => {
              const t = trackerMap.get(e.trackerId);
              const time = new Date(e.createdAt).toLocaleTimeString("en", {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <li key={e.id} className="relative pl-6">
                  <span
                    className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full ring-2 ring-background"
                    style={{ background: t?.color ?? "hsl(var(--primary))" }}
                  />
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
                        {t?.name ?? "Unknown"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {e.done ? "Completed" : e.value != null ? `${e.value} ${t?.unit ?? ""}` : "Logged"}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground shrink-0">{time}</div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
