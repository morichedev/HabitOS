# HabitOS

The operating system for your habits. A premium, offline-first personal-tracking platform built with Next.js 15, TypeScript, Tailwind, shadcn-style components, Framer Motion, Zustand, Dexie/IndexedDB, Recharts, and React Three Fiber.

> Designed to feel like a mix of Linear, Notion, Apple and Raycast — fast, fluid, beautiful.

---

## Highlights

- **Frontend-first**: 100% works offline via IndexedDB. No backend required.
- **Hybrid login** ready: account is optional. Architecture prepared for Supabase sync.
- **Dynamic tracker engine**: build any tracker — boolean, count, duration, scale, weight, calories, exercise or freeform metric.
- **Premium UI**: glassmorphism, gradients, motion design, ambient 3D, spring animations.
- **Insights engine**: streaks, heatmaps, weekly momentum, PRs, gym volume, auto-generated patterns.
- **PWA-ready**: installable, offline service worker, mobile-first.
- **SEO**: dynamic metadata, OG, schema.org SoftwareApplication, sitemap, robots.

## Quickstart

```bash
# 1) Install dependencies
npm install

# 2) Dev server
npm run dev

# 3) Type-check / build
npm run typecheck
npm run build
```

Open http://localhost:3000

> Optional: copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_APP_URL`. Supabase keys are placeholders — sync is on the roadmap.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page (public, SEO-optimized, 3D hero) |
| `/onboarding` | 5-step setup wizard (profile, TDEE, templates) |
| `/dashboard` | Daily home — KPIs, heatmaps, charts, insights, ambient 3D |
| `/habits` | Habit CRUD + week strip + 30-day heatmap |
| `/gym` | Workout logger, PRs, weekly volume chart |
| `/study` | Study minutes logger + 14-day chart |
| `/analytics` | Momentum, weekday distribution, category breakdown, streak leaderboard |
| `/calendar` | Month grid with day-level entries |
| `/profile` | Personal data, TDEE & calorie target |
| `/settings` | Theme, units, export/import, data reset |
| `/login`, `/signup` | Auth UI (cloud sync coming soon) |

## Architecture

```
src/
├── app/                       # Next.js App Router
│   ├── layout.tsx             # Root layout + providers
│   ├── page.tsx               # Landing
│   ├── globals.css            # Design tokens (light/dark) + utilities
│   ├── (app)/                 # Authenticated/private route group with AppShell
│   │   ├── dashboard/
│   │   ├── habits/
│   │   ├── gym/
│   │   ├── study/
│   │   ├── analytics/
│   │   ├── calendar/
│   │   ├── profile/
│   │   └── settings/
│   ├── onboarding/
│   ├── login/, signup/
│   ├── robots.ts, sitemap.ts
│   └── not-found.tsx
├── components/
│   ├── ui/                    # shadcn-style primitives (button, card, dialog, …)
│   ├── marketing/             # Landing sections (hero, features, pricing, …)
│   ├── shell/                 # App shell (sidebar, theme toggle)
│   ├── three/                 # React Three Fiber accents (HeroOrb, AmbientGlow)
│   ├── providers.tsx
│   └── service-worker.tsx
├── features/
│   ├── onboarding/            # Multi-step wizard
│   ├── dashboard/             # Dashboard + widgets
│   ├── habits/                # Habit CRUD + form dialog
│   ├── gym/                   # Workout logger
│   ├── study/, analytics/, calendar/, profile/, settings/, auth/
├── lib/
│   ├── schemas.ts             # Zod schemas + TDEE math
│   ├── db.ts                  # Dexie (IndexedDB)
│   ├── store.ts               # Zustand store + Dexie wiring
│   ├── analytics.ts           # Streaks, heatmaps, insights, PRs, volume
│   ├── templates.ts           # Starter packs
│   ├── date.ts, utils.ts
└── public/
    ├── manifest.webmanifest, favicon.svg, og.svg, sw.js
```

## Design system

- **Tokens** in `src/app/globals.css` — light & dark, HSL based, gradient-friendly.
- **Tailwind** `tailwind.config.ts` extends with: `aurora`, `bg-grid`, `bg-dots`, `glow`, `elevated`, custom keyframes (fade-up, shimmer, float, pulse-glow, spin-slow).
- **Typography**: Inter (sans) + Manrope (display).
- **Components**: shadcn-style primitives (Button, Card, Dialog, Tooltip, Select, Tabs, Switch, etc.) using Radix.
- **Motion**: Framer Motion for page transitions, list reorders, layout animations.

## Tracker engine

Every tracker is defined by a Zod schema with: `category`, `type`, `frequency`, `targetMin/Max`, `unit`, `color`, `icon`. Supported types:

```
boolean   – daily check-in
count     – e.g. pushups, glasses of water
duration  – minutes
scale     – 1–10 (mood, energy)
weight    – kg/lb (body composition)
calories  – kcal
exercise  – structured sets/reps/weight (gym)
free      – any number
```

Entries live in a separate Dexie table keyed by `[trackerId+date]` for fast lookup.

## Performance

- Dynamic imports for 3D (`hero-orb`, `ambient-glow`) — heavy WebGL never blocks first paint.
- `next/font` with Inter + Manrope (variable, swap).
- `optimizePackageImports` for `lucide-react`, `framer-motion`, `recharts`.
- Reduced-motion media query disables animations system-wide.
- AVIF/WebP image formats by default.

## Deploy

Optimized for Vercel:

```bash
vercel --prod
```

Make sure `NEXT_PUBLIC_APP_URL` is set in the project's environment variables.

## Roadmap

- Supabase cloud sync (auth schema ready)
- CSV export
- Apple Health / Google Fit import
- Custom widget reordering (drag & drop)
- AI weekly review email

---

Built with care. Made for people who care about their progress.
