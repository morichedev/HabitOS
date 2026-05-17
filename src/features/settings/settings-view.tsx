"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Download, Trash2, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";

export function SettingsView() {
  const settings = useAppStore((s) => s.settings);
  const saveSettings = useAppStore((s) => s.saveSettings);
  const resetAll = useAppStore((s) => s.resetAll);
  const trackers = useAppStore((s) => s.trackers);
  const entries = useAppStore((s) => s.entries);
  const profile = useAppStore((s) => s.profile);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const fileRef = React.useRef<HTMLInputElement>(null);

  function exportData() {
    const data = { profile, settings, trackers, entries, exportedAt: Date.now() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `habitos-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: "Your data is downloading." });
  }

  function importFile(file: File) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        // Simplified — would validate against Zod in production
        toast({
          title: "Import received",
          description: `Found ${data.trackers?.length ?? 0} trackers and ${data.entries?.length ?? 0} entries. Manual restore coming soon.`,
        });
      } catch {
        toast({ title: "Invalid file", description: "Could not parse JSON.", variant: "destructive" });
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="container py-8 sm:py-10 max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">Personalize your experience.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Theme and visual preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Row label="Theme">
            <Select value={theme ?? "system"} onValueChange={setTheme}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </Row>
          <Row label="Reduce motion" hint="Disable animations and transitions">
            <Switch
              checked={settings.reduceMotion}
              onCheckedChange={(v) => saveSettings({ reduceMotion: v })}
            />
          </Row>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>How the app behaves for you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Row label="Week starts on">
            <Select
              value={settings.weekStart}
              onValueChange={(v) => saveSettings({ weekStart: v as "mon" | "sun" })}
            >
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mon">Monday</SelectItem>
                <SelectItem value="sun">Sunday</SelectItem>
              </SelectContent>
            </Select>
          </Row>
          <Row label="Units">
            <Select
              value={settings.unitSystem}
              onValueChange={(v) => saveSettings({ unitSystem: v as "metric" | "imperial" })}
            >
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                <SelectItem value="imperial">Imperial (lb, in)</SelectItem>
              </SelectContent>
            </Select>
          </Row>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data</CardTitle>
          <CardDescription>Your data lives in your browser. Export it anytime.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={exportData}>
              <Download className="h-4 w-4" /> Export JSON
            </Button>
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" /> Import JSON
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              hidden
              onChange={(e) => e.target.files?.[0] && importFile(e.target.files[0])}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {trackers.length} trackers · {entries.length} entries stored locally.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>Permanently delete all your local data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="border-destructive/40 text-destructive hover:bg-destructive/10"
            onClick={() => {
              if (confirm("This will delete ALL your data. Are you sure?")) {
                resetAll();
                toast({ title: "Reset complete", description: "All local data removed." });
              }
            }}
          >
            <Trash2 className="h-4 w-4" /> Reset everything
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-0.5">
        <Label>{label}</Label>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  );
}
