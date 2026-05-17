import type { Metadata } from "next";
import { GymView } from "@/features/gym/gym-view";

export const metadata: Metadata = {
  title: "Gym",
  description: "Track sets, reps, weight and PRs with weekly volume analytics.",
  robots: { index: false },
};

export default function GymPage() {
  return <GymView />;
}
