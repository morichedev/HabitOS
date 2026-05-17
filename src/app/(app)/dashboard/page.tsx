import type { Metadata } from "next";
import { Dashboard } from "@/features/dashboard/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personalized dashboard — habits, streaks, gym, calories and insights.",
  robots: { index: false },
};

export default function DashboardPage() {
  return <Dashboard />;
}
