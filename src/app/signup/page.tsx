import type { Metadata } from "next";
import { AuthCard } from "@/features/auth/auth-card";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a free HabitOS account to sync across devices.",
  robots: { index: false },
};

export default function SignupPage() {
  return <AuthCard mode="signup" />;
}
