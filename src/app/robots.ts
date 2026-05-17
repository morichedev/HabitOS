import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://habitos.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/habits", "/gym", "/study", "/analytics", "/calendar", "/settings", "/profile", "/onboarding", "/login", "/signup"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
