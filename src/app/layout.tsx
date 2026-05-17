import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://habitos.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HabitOS — The operating system for your habits",
    template: "%s · HabitOS",
  },
  description:
    "HabitOS is a premium, offline-first tracking platform for habits, gym, study, productivity, calories and any metric you care about. Beautiful. Fast. Yours.",
  keywords: [
    "habit tracker",
    "productivity",
    "gym tracker",
    "calorie tracker",
    "personal analytics",
    "self improvement",
    "quantified self",
  ],
  authors: [{ name: "HabitOS" }],
  creator: "HabitOS",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "HabitOS — The operating system for your habits",
    description:
      "Track anything. See everything. A premium personal analytics platform built for people who care about their progress.",
    siteName: "HabitOS",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "HabitOS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HabitOS — The operating system for your habits",
    description: "Track anything. See everything.",
    images: ["/og.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0c" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${manrope.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
