import type { Metadata } from "next";
import { CalendarView } from "@/features/calendar/calendar-view";

export const metadata: Metadata = {
  title: "Calendar",
  robots: { index: false },
};

export default function CalendarPage() {
  return <CalendarView />;
}
