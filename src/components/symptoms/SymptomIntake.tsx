import { ArrowRight, ShieldAlert } from "lucide-react";

import { Field } from "@/components/form/Field";
import { OptionTile } from "@/components/form/OptionTile";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EMERGENCY_SIGNS, severeSymptomsIn } from "@/lib/emergency";
import { SYMPTOMS } from "@/lib/symptoms.schema";

import { EmergencyPanel } from "./EmergencyPanel";

export type IntakeState = {
  emergencySigns: string[];
  symptoms: (typeof SYMPTOMS)[number][];
  description: string;
};

function toggle<T>(list: readonly T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

export function SymptomIntake({
  value,
  onChange,
  onContinue,
  error,
}: {
  value: IntakeState;
  onChange: (v: IntakeState) => void;
  onContinue: () => void;
  error?: string | undefined;
}) {
  const signLabels = EMERGENCY_SIGNS.filter((s) => value.emergencySigns.includes(s.id)).map((s) => s.label);
  const hasEmergency = signLabels.length > 0;
  const severe = severeSymptomsIn(value.symptoms);

  return (
    <div className="space-y-6">
      <section className="soft-card p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-emergency" strokeWidth={1.6} />
          <div>
            <h2 className="text-lg font-semibold">First, are you experiencing any of these right now?</h2>
            <p className="mt-1 font-body text-sm text-muted-foreground">Tick any that apply. Leave blank if none.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-2 md:grid-cols-2">
          {EMERGENCY_SIGNS.map((s) => (
            <OptionTile
              key={s.id}
              selected={value.emergencySigns.includes(s.id)}
              onToggle={() => onChange({ ...value, emergencySigns: toggle(value.emergencySigns, s.id) })}
            >
              {s.label}
            </OptionTile>
          ))}
        </div>
      </section>

      {hasEmergency ? <EmergencyPanel reasons={signLabels} /> : null}

      <section className="soft-card p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Which symptoms are you experiencing?</h2>
        <p className="mt-1 font-body text-sm text-muted-foreground">Select all that apply.</p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" data-field-error={error ? "true" : undefined}>
          {SYMPTOMS.map((s) => (
            <OptionTile
              key={s}
              selected={value.symptoms.includes(s)}
              onToggle={() => onChange({ ...value, symptoms: toggle(value.symptoms, s) })}
            >
              {s}
            </OptionTile>
          ))}
        </div>
        <Field
          label="Describe any additional symptoms"
          htmlFor="symptom-desc"
          optional
          className="mt-6"
          error={error}
          hint="For example, when it started or what makes it better or worse."
        >
          <Textarea
            id="symptom-desc"
            maxLength={1000}
            placeholder="Tell Baymini more about how you feel"
            value={value.description}
            onChange={(e) => onChange({ ...value, description: e.target.value })}
          />
        </Field>
      </section>

      {severe.length > 0 && !hasEmergency ? (
        <div className="space-y-2">
          <EmergencyPanel reasons={severe} />
          <p className="px-2 font-body text-sm text-muted-foreground">
            If this is severe, sudden or getting worse, get emergency help now. If it is mild and you
            feel safe, you can continue below.
          </p>
        </div>
      ) : null}

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <Button size="lg" onClick={onContinue} disabled={hasEmergency}>
          Continue <ArrowRight strokeWidth={1.8} />
        </Button>
        {hasEmergency ? (
          <p className="font-body text-sm text-emergency">
            Please seek emergency care first. Untick the signs above if you selected them by mistake.
          </p>
        ) : null}
      </div>
    </div>
  );
}
