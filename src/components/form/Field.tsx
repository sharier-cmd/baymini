import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
  optional,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string | undefined;
  children: ReactNode;
  className?: string;
  optional?: boolean;
}) {
  return (
    <div className={cn("space-y-2", className)} data-field-error={error ? "true" : undefined}>
      <div className="flex items-baseline justify-between gap-3">
        {htmlFor ? (
          <label htmlFor={htmlFor} className="font-display text-sm font-semibold text-foreground">
            {label}
          </label>
        ) : (
          <p className="font-display text-sm font-semibold text-foreground">{label}</p>
        )}
        {optional ? <span className="font-body text-xs text-muted-foreground">Optional</span> : null}
      </div>
      {children}
      {error ? (
        <p role="alert" className="font-body text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="font-body text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function FormSection({
  letter,
  title,
  description,
  children,
}: {
  letter: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="soft-card p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-soft font-display text-sm font-bold text-primary">
          {letter}
        </span>
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {description ? (
            <p className="mt-1 font-body text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-7 space-y-7">{children}</div>
    </section>
  );
}

export function UnitToggle<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-full border border-border bg-muted p-0.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={cn(
            "rounded-full px-3 py-1 font-display text-xs font-semibold transition-colors",
            value === o ? "bg-card text-primary shadow-soft" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
