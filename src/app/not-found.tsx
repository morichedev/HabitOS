import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center px-4 text-center">
      <div>
        <div className="font-display text-7xl font-bold gradient-text">404</div>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild variant="gradient" className="mt-6">
          <Link href="/">Take me home</Link>
        </Button>
      </div>
    </div>
  );
}
