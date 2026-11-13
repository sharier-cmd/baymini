import { Check } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function OptionTile({
  selected,
  onToggle,
  kind = "checkbox",
  children,
  description,
  className,
}: {
  selected: boolean;
  onToggle: () => void;
  kind?: "checkbox" | "radio";
  children: ReactNode;
  description?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role={kind}
      aria-checked={selected}
      data-selected={selected}
      onClick={onToggle}
      className={cn("option-tile w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center border transition-colors",
          kind === "radio" ? "rounded-full" : "rounded-md",
          selected ? "border-leaf bg-leaf text-primary-foreground" : "border-input bg-card",
        )}
      >
        {selected ? (
          kind === "radio" ? (
            <span className="h-2 w-2 rounded-full bg-primary-foreground" />
          ) : (
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
          )
        ) : null}
      </span>
      <span className="min-w-0">
        <span className="block font-display text-sm font-medium text-foreground">{children}</span>
        {description ? (
          <span className="mt-0.5 block font-body text-xs text-muted-foreground">{description}</span>
        ) : null}
      </span>
    </button>
  );
}
