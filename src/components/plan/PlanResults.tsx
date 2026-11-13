import {
  Apple,
  BedDouble,
  Droplets,
  Dumbbell,
  Moon,
  Pencil,
  Printer,
  RotateCcw,
  ShieldAlert,
  Stethoscope,
  Sun,
  Sunset,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { Disclaimer } from "@/components/site/Disclaimer";
import { SampleBanner } from "@/components/site/AiStatus";
import { Button } from "@/components/ui/button";
import { goalLabel, type HealthPlan } from "@/lib/health-plan.schema";

function Section({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <section className="soft-card print-plain p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="icon-chip h-10 w-10">
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Item({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-muted p-4">
      <p className="eyebrow">{label}</p>
      <div className="mt-1.5 font-body leading-relaxed text-foreground">{children}</div>
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((t) => (
        <li key={t} className="flex gap-2">
          <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function PlanResults({
  plan,
  primaryGoal,
  isSample,
  onRegenerate,
  onEdit,
}: {
  plan: HealthPlan;
  primaryGoal: string;
  isSample: boolean;
  onRegenerate: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="space-y-6 animate-fade-up">
      {isSample ? <SampleBanner /> : null}

      <header className="soft-card print-plain p-7 sm:p-10">
        <p className="eyebrow">Primary goal: {goalLabel(primaryGoal)}</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Your Personalized Health Plan</h1>
        <p className="mt-4 max-w-3xl font-body text-lg leading-relaxed text-muted-foreground">{plan.intro}</p>
        <div className="no-print mt-7 flex flex-wrap gap-3">
          <Button onClick={onRegenerate}>
            <RotateCcw strokeWidth={1.6} /> Regenerate Health Plan
          </Button>
          <Button variant="outline" onClick={onEdit}>
            <Pencil strokeWidth={1.6} /> Return to Edit Information
          </Button>
          <Button variant="ghost" onClick={() => window.print()}>
            <Printer strokeWidth={1.6} /> Print or Save as PDF
          </Button>
        </div>
      </header>

      {plan.importantNotes.length > 0 ? (
        <section className="print-plain rounded-3xl border border-warning/40 bg-warning-soft p-6">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-warning" strokeWidth={1.6} />
            <h2 className="font-display font-semibold">Important for you</h2>
          </div>
          <div className="mt-3 font-body text-foreground">
            <Bullets items={plan.importantNotes} />
          </div>
        </section>
      ) : null}

      <Section icon={Sun} title="Morning Routine">
        <div className="grid gap-3 md:grid-cols-2">
          <Item label="Wake-up">{plan.morning.wakeUp}</Item>
          <Item label="Breakfast">{plan.morning.breakfast}</Item>
          <Item label="Morning habits"><Bullets items={plan.morning.habits} /></Item>
          <Item label="Physical activity">{plan.morning.activity}</Item>
        </div>
      </Section>

      <Section icon={Sunset} title="Afternoon Routine">
        <div className="grid gap-3 md:grid-cols-2">
          <Item label="Lunch">{plan.afternoon.lunch}</Item>
          <Item label="Hydration">{plan.afternoon.hydration}</Item>
          <Item label="Movement">{plan.afternoon.movement}</Item>
          <Item label="Healthy habits"><Bullets items={plan.afternoon.habits} /></Item>
        </div>
      </Section>

      <Section icon={Moon} title="Evening Routine">
        <div className="grid gap-3 md:grid-cols-2">
          <Item label="Dinner">{plan.evening.dinner}</Item>
          <Item label="Relaxation">{plan.evening.relaxation}</Item>
          <Item label="Recovery">{plan.evening.recovery}</Item>
          <Item label="Sleep preparation">{plan.evening.sleepPrep}</Item>
        </div>
      </Section>

      <Section icon={Apple} title="Personalized Daily Diet">
        <div className="grid gap-4 md:grid-cols-2">
          {plan.diet.meals.map((m) => (
            <div key={m.meal} className="rounded-2xl border border-border p-5">
              <h3 className="font-display text-lg font-semibold">{m.meal}</h3>
              <div className="mt-3 font-body text-foreground">
                <Bullets items={m.items} />
              </div>
              <dl className="mt-4 space-y-2 font-body text-sm">
                <div>
                  <dt className="font-display font-semibold text-foreground">Suggested portion</dt>
                  <dd className="text-muted-foreground">{m.portion}</dd>
                </div>
                <div>
                  <dt className="font-display font-semibold text-foreground">Estimated nutrition</dt>
                  <dd className="text-muted-foreground">{m.nutritionEstimate}</dd>
                </div>
                <div>
                  <dt className="font-display font-semibold text-foreground">Affordable alternative</dt>
                  <dd className="text-muted-foreground">{m.affordableAlternative}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Item label="Estimated daily intake">{plan.diet.estimatedDailyIntake}</Item>
          <Item label="Locally available foods">
            <div className="mt-1 flex flex-wrap gap-2">
              {plan.diet.localFoods.map((f) => (
                <span key={f} className="rounded-full bg-card px-3 py-1 text-sm">{f}</span>
              ))}
            </div>
          </Item>
        </div>
        <p className="mt-4 font-body text-xs text-muted-foreground">
          Calorie and nutrition values are rough estimates, not exact prescriptions.
        </p>
      </Section>

      <Section icon={Dumbbell} title="Exercise Recommendations">
        <div className="grid gap-3 md:grid-cols-2">
          {plan.exercise.items.map((x) => (
            <div key={x.name} className="rounded-2xl border border-border p-5">
              <h3 className="font-display font-semibold">{x.name}</h3>
              <p className="mt-2 font-body text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{x.duration}</span> · {x.intensity}
              </p>
              <p className="mt-3 font-body text-sm">
                <span className="font-display font-semibold">Beginner-friendly: </span>
                {x.beginnerAlternative}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Item label="Rest and recovery">{plan.exercise.restAndRecovery}</Item>
        </div>
      </Section>

      <Section icon={BedDouble} title="Sleep and Lifestyle">
        <div className="grid gap-3 md:grid-cols-2">
          <Item label="Sleep routine">{plan.sleepLifestyle.sleepRoutine}</Item>
          <Item label="Hydration">
            <span className="inline-flex items-start gap-2">
              <Droplets className="mt-1 h-4 w-4 shrink-0 text-leaf" strokeWidth={1.6} />
              {plan.sleepLifestyle.hydration}
            </span>
          </Item>
          <Item label="Sleep hygiene"><Bullets items={plan.sleepLifestyle.sleepHygiene} /></Item>
          <Item label="Stress management"><Bullets items={plan.sleepLifestyle.stressManagement} /></Item>
          <Item label="Healthy daily habits"><Bullets items={plan.sleepLifestyle.dailyHabits} /></Item>
        </div>
      </Section>

      <Section icon={Stethoscope} title="When to see a professional">
        <div className="font-body">
          <Bullets items={plan.whenToSeeAProfessional} />
        </div>
      </Section>

      <Disclaimer />
      <p className="font-body text-xs text-muted-foreground">
        This plan is general personalized wellness guidance, not a medical prescription.
      </p>
    </div>
  );
}
