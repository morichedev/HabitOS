import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 mt-10">
      <div className="container py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg gradient-brand flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-bold tracking-tight">HabitOS</span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            The operating system for your habits. Track anything. See everything.
          </p>
        </div>
        <FooterCol
          title="Product"
          links={[
            { label: "Features", href: "#features" },
            { label: "Trackers", href: "#trackers" },
            { label: "Pricing", href: "#pricing" },
            { label: "Dashboard", href: "/dashboard" },
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            { label: "About", href: "#" },
            { label: "Blog", href: "#" },
            { label: "Contact", href: "mailto:hello@habitos.app" },
          ]}
        />
        <FooterCol
          title="Legal"
          links={[
            { label: "Privacy", href: "#" },
            { label: "Terms", href: "#" },
            { label: "Cookies", href: "#" },
          ]}
        />
      </div>
      <div className="border-t border-border/60">
        <div className="container py-5 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} HabitOS. Crafted with care.</span>
          <span>Made for people who care about their progress.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="font-medium text-foreground/90">{title}</div>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
