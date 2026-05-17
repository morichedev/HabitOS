import type { Metadata } from "next";
import { StudyView } from "@/features/study/study-view";

export const metadata: Metadata = {
  title: "Study",
  robots: { index: false },
};

export default function StudyPage() {
  return <StudyView />;
}
