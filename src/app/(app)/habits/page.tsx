import type { Metadata } from "next";
import { Suspense } from "react";
import { HabitsView } from "@/features/habits/habits-view";

export const metadata: Metadata = {
  title: "Habits",
  description: "Build and track your daily habits with streaks and heatmaps.",
  robots: { index: false },
};

export default function HabitsPage() {
  return (
    <Suspense fallback={null}>
      <HabitsView />
    </Suspense>
  );
}
