"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Calendar,
  Cog,
  Dumbbell,
  GraduationCap,
  Home,
  ListChecks,
  Menu,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/shell/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV = [
  { href: "/dashboard", label: "Today", icon: Home },
  { href: "/habits", label: "Habits", icon: ListChecks },
  { href: "/gym", label: "Gym", icon: Dumbbell },
  { href: "/study", label: "Study", icon: GraduationCap },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/calendar", label: "Calendar", icon: Calendar },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();
  const bootstrap = useAppStore((s) => s.bootstrap);
  const profile = useAppStore((s) => s.profile);

  React.useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen relative">
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 glass-strong border-b border-border/60">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-muted"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md gradient-brand flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-display font-semibold">HabitOS</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="lg:grid lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform lg:translate-x-0 lg:static lg:w-auto lg:z-auto",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="h-full glass-strong border-r border-border/60 flex flex-col">
            <div className="flex items-center justify-between p-5">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg gradient-brand flex items-center justify-center shadow-glow">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="font-display font-bold tracking-tight">HabitOS</span>
              </Link>
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="lg:hidden h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="px-3 space-y-1 flex-1">
              {NAV.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all relative",
                      active
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full gradient-brand" />
                    )}
                    <item.icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-3 space-y-2">
              <Link
                href="/settings"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                <Cog className="h-4 w-4" />
                Settings
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-muted/50 transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {(profile?.name?.[0] ?? "U").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium truncate">
                        {profile?.name ?? "Local user"}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {profile?.email ?? "Offline mode"}
                      </div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Cog className="h-4 w-4" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/login">Sign in to sync</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="hidden lg:flex justify-end pt-1">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Content */}
        <main className="min-h-[calc(100vh-3.5rem)] lg:min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
