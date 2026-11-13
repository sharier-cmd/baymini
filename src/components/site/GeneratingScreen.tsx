import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { LogoMark } from "./Logo";

export type Stage = { label: string; state: "done" | "active" | "pending" };

/** Loading view whose stages mirror real request states, plus a live elapsed-time counter. */
export function GeneratingScreen({ title, stages }: { title: string; stages: Stage[] }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div role="status" aria-live="polite" className="soft-card mx-auto max-w-lg p-8 text-center sm:p-10">
      <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-sage animate-breathe" />
        <LogoMark className="relative h-12 w-12" />
      </div>
      <h2 className="mt-6 text-2xl font-semibold">{title}</h2>
      <p className="mt-1 font-body text-sm text-muted-foreground">
        This usually takes 15 to 45 seconds. Elapsed: {seconds}s
      </p>
      <ol className="mx-auto mt-8 max-w-sm space-y-3 text-left">
        {stages.map((s) => (
          <li key={s.label} className="flex items-center gap-3">
            <span
              className={
                s.state === "done"
                  ? "flex h-6 w-6 items-center justify-center rounded-full bg-leaf text-primary-foreground"
                  : s.state === "active"
                    ? "flex h-6 w-6 items-center justify-center rounded-full bg-sage-soft text-primary"
                    : "flex h-6 w-6 items-center justify-center rounded-full border border-border"
              }
            >
              {s.state === "done" ? (
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              ) : s.state === "active" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
              ) : null}
            </span>
            <span
              className={
                s.state === "pending"
                  ? "font-body text-sm text-muted-foreground"
                  : "font-display text-sm font-medium text-foreground"
              }
            >
              {s.label}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
