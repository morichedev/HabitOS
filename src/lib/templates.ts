import type { Tracker } from "./schemas";

export type TemplateKey =
  | "student"
  | "gym"
  | "productivity"
  | "habits"
  | "reading"
  | "mindfulness";

type TrackerSeed = Omit<Tracker, "id" | "createdAt" | "updatedAt" | "order">;

export const TEMPLATES: Record<
  TemplateKey,
  { label: string; description: string; icon: string; trackers: TrackerSeed[] }
> = {
  habits: {
    label: "Daily habits",
    description: "Build a consistent foundation with simple daily checkmarks.",
    icon: "Sparkles",
    trackers: [
      seed("Wake up early", "habit", "boolean", "Sunrise", "#F59E0B"),
      seed("Drink 2L water", "habit", "count", "Droplet", "#22D3EE", { unit: "L", targetMin: 2 }),
      seed("Walk 8k steps", "habit", "count", "Footprints", "#34D399", { unit: "steps", targetMin: 8000 }),
      seed("No screens after 22h", "habit", "boolean", "Moon", "#A78BFA"),
    ],
  },
  gym: {
    label: "Gym & strength",
    description: "Track lifts, sets, reps, weight and weekly volume.",
    icon: "Dumbbell",
    trackers: [
      seed("Workout", "gym", "exercise", "Dumbbell", "#7C5CFF"),
      seed("Body weight", "gym", "weight", "Scale", "#F472B6", { unit: "kg" }),
      seed("Protein", "nutrition", "count", "Beef", "#EF4444", { unit: "g", targetMin: 120 }),
    ],
  },
  productivity: {
    label: "Deep work",
    description: "Focus blocks, shipped tasks and weekly review.",
    icon: "Zap",
    trackers: [
      seed("Deep work", "productivity", "duration", "Brain", "#7C5CFF", { unit: "min", targetMin: 120 }),
      seed("Tasks shipped", "productivity", "count", "CheckSquare", "#22D3EE"),
      seed("Inbox zero", "productivity", "boolean", "Inbox", "#34D399"),
    ],
  },
  student: {
    label: "Student mode",
    description: "Study hours, problems solved, exams readiness.",
    icon: "GraduationCap",
    trackers: [
      seed("Study", "study", "duration", "BookOpen", "#7C5CFF", { unit: "min", targetMin: 90 }),
      seed("Problems solved", "study", "count", "Calculator", "#22D3EE"),
      seed("Lectures watched", "study", "count", "PlayCircle", "#F59E0B"),
    ],
  },
  reading: {
    label: "Reading",
    description: "Pages read, books finished and reading streak.",
    icon: "BookOpen",
    trackers: [
      seed("Pages read", "reading", "count", "BookOpen", "#34D399", { unit: "pages", targetMin: 20 }),
      seed("Read 20 min", "reading", "boolean", "Clock", "#22D3EE"),
    ],
  },
  mindfulness: {
    label: "Mindfulness",
    description: "Meditation, gratitude and mood tracking.",
    icon: "Flower2",
    trackers: [
      seed("Meditation", "mindfulness", "duration", "Flower2", "#A78BFA", { unit: "min", targetMin: 10 }),
      seed("Gratitude", "mindfulness", "boolean", "Heart", "#F472B6"),
      seed("Mood", "mindfulness", "scale", "Smile", "#F59E0B"),
    ],
  },
};

function seed(
  name: string,
  category: Tracker["category"],
  type: Tracker["type"],
  icon: string,
  color: string,
  extra: Partial<Tracker> = {}
): TrackerSeed {
  return {
    name,
    category,
    type,
    icon,
    color,
    frequency: "daily",
    archived: false,
    ...extra,
  };
}
