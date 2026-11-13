import { AlertTriangle, FlaskConical, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AiErrorCode } from "@/lib/ai-result";

export function AiErrorCard({
  code,
  message,
  onRetry,
  onShowSample,
}: {
  code: AiErrorCode;
  message: string;
  onRetry?: () => void;
  onShowSample?: () => void;
}) {
  const notConfigured = code === "not_configured";
  return (
    <div role="alert" className="soft-card mx-auto max-w-xl p-8 text-center">
      <span className="icon-chip mx-auto h-12 w-12">
        <AlertTriangle className="h-5 w-5" strokeWidth={1.6} />
      </span>
      <h2 className="mt-4 text-xl font-semibold">
        {notConfigured ? "AI service not set up" : "We couldn't finish that"}
      </h2>
      <p className="mt-2 font-body text-muted-foreground">{message}</p>
      {notConfigured ? (
        <p className="mt-2 font-body text-sm text-muted-foreground">
          The site owner needs to enable AI for this project. You can preview a clearly labeled
          sample in the meantime.
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {onRetry ? (
          <Button onClick={onRetry}>
            <RotateCcw strokeWidth={1.6} /> Try again
          </Button>
        ) : null}
        {notConfigured && onShowSample ? (
          <Button variant="outline" onClick={onShowSample}>
            <FlaskConical strokeWidth={1.6} /> View sample (demo)
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function SampleBanner() {
  return (
    <div
      role="note"
      className="flex items-start gap-3 rounded-2xl border border-warning/40 bg-warning-soft px-4 py-3 font-body text-sm text-foreground"
    >
      <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-warning" strokeWidth={1.6} />
      <p>
        <strong className="font-display">Sample data, not AI-generated.</strong> This demo shows the
        layout only. It is not based on your information and is not health guidance.
      </p>
    </div>
  );
}
