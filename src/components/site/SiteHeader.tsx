import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { Logo } from "./Logo";
import { featureLinks } from "./nav-links";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 rounded-full border border-border bg-card/85 pl-4 pr-2 shadow-nav backdrop-blur-md sm:pl-5"
      >
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {featureLinks.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="rounded-full px-4 py-2 font-display text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "bg-sage-soft text-primary" }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu strokeWidth={1.6} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm bg-background">
              <SheetHeader>
                <SheetTitle className="text-left font-display">Menu</SheetTitle>
              </SheetHeader>
              <ul className="mt-2 flex flex-col gap-1 px-4">
                <li>
                  <Link
                    to="/"
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 font-display font-medium text-foreground hover:bg-accent"
                    activeOptions={{ exact: true }}
                    activeProps={{ className: "bg-sage-soft text-primary" }}
                  >
                    Home
                  </Link>
                </li>
                {featureLinks.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className="block rounded-2xl px-4 py-3 font-display font-medium text-foreground hover:bg-accent"
                      activeProps={{ className: "bg-sage-soft text-primary" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
