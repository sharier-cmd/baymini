import type { ReactNode } from "react";

export function PageHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1 className="mt-3 text-4xl font-bold text-foreground sm:text-5xl">{title}</h1>
      {children ? (
        <div className="mt-4 font-body text-lg leading-relaxed text-muted-foreground">{children}</div>
      ) : null}
    </div>
  );
}
