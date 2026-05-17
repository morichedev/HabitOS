import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/nav";
import { Hero } from "@/components/marketing/hero";
import { SocialProof } from "@/components/marketing/social-proof";
import { Features } from "@/components/marketing/features";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { TrackersShowcase } from "@/components/marketing/trackers-showcase";
import { Pricing } from "@/components/marketing/pricing";
import { Faq } from "@/components/marketing/faq";
import { CTA } from "@/components/marketing/cta";
import { Footer } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "HabitOS — The operating system for your habits",
  description:
    "Track habits, workouts, study, productivity, calories and any custom metric. Premium, offline-first, beautifully fast.",
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "HabitOS",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Web, iOS, Android",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "240",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MarketingNav />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <DashboardPreview />
        <TrackersShowcase />
        <Pricing />
        <Faq />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
