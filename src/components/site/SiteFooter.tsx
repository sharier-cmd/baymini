import { Link } from "@tanstack/react-router";

import { Logo } from "./Logo";
import { featureLinks } from "./nav-links";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="no-print mt-24 border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground">
            Baymini helps you understand your health with personalized wellness plans and AI-assisted
            symptom guidance, for everyday decisions.
          </p>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold text-foreground">Features</h3>
          <ul className="mt-4 space-y-3 font-body text-sm">
            {featureLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-muted-foreground transition-colors hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold text-foreground">Baymini</h3>
          <ul className="mt-4 space-y-3 font-body text-sm">
            <li>
              <Link to="/about" className="text-muted-foreground transition-colors hover:text-primary">
                About Baymini
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-muted-foreground transition-colors hover:text-primary">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/medical-disclaimer"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                Medical Disclaimer
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 font-body text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} Baymini. All rights reserved.</p>
          <p>General wellness information only. Not a substitute for professional medical advice.</p>
        </div>
      </div>
    </footer>
  );
}
