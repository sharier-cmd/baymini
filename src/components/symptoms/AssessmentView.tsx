import {
  AlertTriangle,
  CalendarClock,
  HeartHandshake,
  Lightbulb,
  RotateCcw,
  Pencil,
  Siren,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import type { Assessment } from "@/lib/symptoms.schema";
import { cn } from "@/lib/utils";

const URGENCY: Record<Assessment["urgency"], { label: string; icon: LucideIcon; box: string; text: string }> = {
  emergency: { label: "Emergency", icon: Siren, box: "border-2 border-emergency bg-emergency-soft", text: "text-emergency" },
  prompt: { label: "Seek medical attention promptly", icon: AlertTriangle, box: "border border-warning/50 bg-warning-soft", text: "text-warning" },
  routine: { label: "Routine medical consultation", icon: CalendarClock, box: "border border-caution/40 bg-caution-soft", text: "text-caution" },
  self_care: { label: "General self-care may be reasonable", icon: HeartHandshake, box: "border border-calm/30 bg-calm-soft", text: "text-calm" },
};

function Card({ icon: Icon, title, children, className }: { icon: LucideIcon; title: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("soft-card p-6 sm:p-7", className)}>
      <div className="flex items-center gap-3">
        <span className="icon-chip h-10 w-10">
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="mt-5 font-body">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((t) => (
        <li key={t} className="flex gap-2.5">
          <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function AssessmentView({
  assessment: a,
  onEdit,
  onRestart,
}: {
  assessment: Assessment;
  onEdit: () => void;
  onRestart: () => void;
}) {
  const u = URGENCY[a.urgency];
  return (
    <div className="space-y-5 animate-fade-up">
      <section className={cn("rounded-3xl p-6 sm:p-8", u.box)}>
        <div className="flex items-start gap-4">
          <u.icon className={cn("mt-1 h-7 w-7 shrink-0", u.text)} strokeWidth={1.6} />
          <div>
            <p className="eyebrow">Urgency level</p>
            <h2 className={cn("mt-1 text-2xl font-bold", u.text)}>{u.label}</h2>
            <p className="mt-2 font-body text-foreground">{a.urgencyReason}</p>
          </div>
        </div>
      </section>

      <section className="soft-card p-6 sm:p-7">
        <p className="eyebrow">What you shared</p>
        <p className="mt-2 font-body leading-relaxed text-foreground">{a.summary}</p>
      </section>

      <Card icon={Lightbulb} title="Possible explanations">
        <p className="mb-4 text-sm text-muted-foreground">
          These are possibilities to discuss with a professional, not a diagnosis.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {a.possibleExplanations.map((p) => (
            <div key={p.name} className="rounded-2xl bg-muted p-4">
              <h3 className="font-display font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.explanation}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card icon={HeartHandshake} title="General self-care guidance">
          <Bullets items={a.selfCare} />
        </Card>
        <Card icon={Stethoscope} title="When to contact a professional">
          <Bullets items={a.whenToSeekHelp} />
        </Card>
      </div>

      <section className="rounded-3xl border border-emergency/40 bg-emergency-soft p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <Siren className="h-5 w-5 text-emergency" strokeWidth={1.6} />
          <h2 className="text-lg font-semibold">Get emergency care immediately if</h2>
        </div>
        <div className="mt-4 font-body text-foreground">
          <Bullets items={a.emergencySigns} />
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" size="lg" onClick={onEdit}>
          <Pencil strokeWidth={1.6} /> Edit my answers
        </Button>
        <Button size="lg" onClick={onRestart}>
          <RotateCcw strokeWidth={1.6} /> Start a new check
        </Button>
      </div>
    </div>
  );
}
