import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      className={cn("h-9 w-9 shrink-0", className)}
    >
      <rect width="40" height="40" rx="12" className="fill-primary" />
      <path
        d="M14 10.5h7.4c3.6 0 5.9 1.9 5.9 4.9 0 2-1.1 3.4-2.8 4.1 2.2.6 3.7 2.3 3.7 4.7 0 3.4-2.6 5.3-6.6 5.3H14z"
        className="fill-none stroke-primary-foreground"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M14 19.7h7.6" className="stroke-primary-foreground" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="29.5" cy="10.5" r="2.2" className="fill-sage" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="Baymini home"
      className={cn("flex items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
    >
      <LogoMark />
      <span className="font-display text-lg font-bold tracking-tight text-foreground">Baymini</span>
    </Link>
  );
}
