import { PhoneCall, Siren } from "lucide-react";

export function EmergencyPanel({ reasons, compact = false }: { reasons: string[]; compact?: boolean }) {
  return (
    <section
      role="alert"
      aria-live="assertive"
      className="rounded-3xl border-2 border-emergency bg-emergency-soft p-6 sm:p-8"
    >
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emergency text-emergency-foreground">
          <Siren className="h-6 w-6" strokeWidth={1.6} />
        </span>
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-emergency sm:text-2xl">This could be a medical emergency</h2>
          <p className="mt-2 font-body text-foreground">
            Call your local emergency number or go to the nearest emergency department now. Do not
            wait for an online assessment.
          </p>
          {reasons.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {reasons.map((r) => (
                <li key={r} className="rounded-full bg-card px-3 py-1 font-body text-sm text-foreground">
                  {r}
                </li>
              ))}
            </ul>
          ) : null}
          {!compact ? (
            <div className="mt-5 grid gap-2 font-body text-sm text-foreground sm:grid-cols-2">
              <p className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-emergency" strokeWidth={1.8} />
                Bangladesh: <strong>999</strong>
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-emergency" strokeWidth={1.8} />
                US and Canada: <strong>911</strong>
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-emergency" strokeWidth={1.8} />
                UK: <strong>999</strong> · EU: <strong>112</strong>
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-emergency" strokeWidth={1.8} />
                India: <strong>112</strong> · Australia: <strong>000</strong>
              </p>
            </div>
          ) : null}
          <p className="mt-4 font-body text-sm text-muted-foreground">
            If you are having thoughts of harming yourself, contact emergency services or a local
            crisis helpline right away, and reach out to someone you trust.
          </p>
        </div>
      </div>
    </section>
  );
}
