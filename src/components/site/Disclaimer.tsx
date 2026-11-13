import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

export const DISCLAIMER_TEXT =
  "Baymini provides AI-generated health information for educational purposes only. It is not a substitute for professional medical diagnosis, treatment or advice.";

export function Disclaimer({ className }: { className?: string }) {
  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-border bg-muted px-4 py-3 font-body text-sm text-muted-foreground",
        className,
      )}
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-leaf" strokeWidth={1.6} />
      <p>{DISCLAIMER_TEXT}</p>
    </div>
  );
}
