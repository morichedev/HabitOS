import type { Metadata } from "next";
import { AnalyticsView } from "@/features/analytics/analytics-view";

export const metadata: Metadata = {
  title: "Analytics",
  robots: { index: false },
};

export default function AnalyticsPage() {
  return <AnalyticsView />;
}
