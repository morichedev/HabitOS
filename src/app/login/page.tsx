import type { Metadata } from "next";
import { AuthCard } from "@/features/auth/auth-card";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to sync your HabitOS across devices.",
  robots: { index: false },
};

export default function LoginPage() {
  return <AuthCard mode="login" />;
}
