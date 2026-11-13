import { Lock, Sparkles, Star } from "lucide-react";
import type { FormEvent } from "react";

import { Field, FormSection, UnitToggle } from "@/components/form/Field";
import { OptionTile } from "@/components/form/OptionTile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ACTIVITY_LEVELS,
  BUDGETS,
  CONDITIONS,
  DIET_TYPES,
  DIETARY_RESTRICTIONS,
  FITNESS_LEVELS,
  GENDERS,
  GOALS,
} from "@/lib/health-plan.schema";
import type { PlanFormErrors, PlanFormState } from "@/lib/plan-form";
import { cn } from "@/lib/utils";

type Props = {
  value: PlanFormState;
  errors: PlanFormErrors;
  onChange: (next: PlanFormState) => void;
  onSubmit: () => void;
};

function toggle<T>(list: readonly T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

export function PlanForm({ value: f, errors, onChange, onSubmit }: Props) {
  const set = <K extends keyof PlanFormState>(key: K, v: PlanFormState[K]) => onChange({ ...f, [key]: v });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  function toggleGoal(id: string) {
    const goals = toggle(f.goals, id);
    let primaryGoal = f.primaryGoal;
    if (!goals.includes(primaryGoal)) primaryGoal = goals[0] ?? "";
    onChange({ ...f, goals, primaryGoal });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* A */}
      <FormSection letter="A" title="Personal information" description="The basics that shape your daily needs.">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Age" htmlFor="age" error={errors.age}>
            <Input
              id="age"
              inputMode="numeric"
              type="number"
              min={13}
              max={100}
              placeholder="e.g. 28"
              value={f.age}
              aria-invalid={!!errors.age}
              onChange={(e) => set("age", e.target.value)}
            />
          </Field>
          <Field label="Country or region" htmlFor="country" error={errors.country} hint="Used to suggest local, affordable foods.">
            <Input
              id="country"
              placeholder="e.g. Bangladesh"
              autoComplete="country-name"
              value={f.country}
              aria-invalid={!!errors.country}
              onChange={(e) => set("country", e.target.value)}
            />
          </Field>

          <Field label="Height" error={errors.heightCm}>
            <div className="flex items-center gap-3">
              {f.heightUnit === "cm" ? (
                <Input
                  aria-label="Height in centimetres"
                  type="number"
                  inputMode="decimal"
                  placeholder="cm"
                  value={f.heightCm}
                  aria-invalid={!!errors.heightCm}
                  onChange={(e) => set("heightCm", e.target.value)}
                />
              ) : (
                <div className="flex w-full gap-2">
                  <Input
                    aria-label="Height feet"
                    type="number"
                    inputMode="numeric"
                    placeholder="ft"
                    value={f.heightFt}
                    aria-invalid={!!errors.heightCm}
                    onChange={(e) => set("heightFt", e.target.value)}
                  />
                  <Input
                    aria-label="Height inches"
                    type="number"
                    inputMode="numeric"
                    placeholder="in"
                    value={f.heightIn}
                    onChange={(e) => set("heightIn", e.target.value)}
                  />
                </div>
              )}
              <UnitToggle label="Height unit" value={f.heightUnit} options={["cm", "ft/in"] as const} onChange={(v) => set("heightUnit", v)} />
            </div>
          </Field>

          <Field label="Weight" error={errors.weightKg}>
            <div className="flex items-center gap-3">
              <Input
                aria-label={`Weight in ${f.weightUnit}`}
                type="number"
                inputMode="decimal"
                placeholder={f.weightUnit}
                value={f.weight}
                aria-invalid={!!errors.weightKg}
                onChange={(e) => set("weight", e.target.value)}
              />
              <UnitToggle label="Weight unit" value={f.weightUnit} options={["kg", "lbs"] as const} onChange={(v) => set("weightUnit", v)} />
            </div>
          </Field>

          <Field label="Average sleep (hours per night)" htmlFor="sleep" error={errors.sleepHours}>
            <Input
              id="sleep"
              type="number"
              step={0.5}
              min={2}
              max={14}
              inputMode="decimal"
              placeholder="e.g. 7"
              value={f.sleepHours}
              aria-invalid={!!errors.sleepHours}
              onChange={(e) => set("sleepHours", e.target.value)}
            />
          </Field>
        </div>

        <Field label="Gender" error={errors.gender}>
          <div role="radiogroup" aria-label="Gender" className="grid gap-2 sm:grid-cols-4">
            {GENDERS.map((g) => (
              <OptionTile key={g} kind="radio" selected={f.gender === g} onToggle={() => set("gender", g)}>
                {g}
              </OptionTile>
            ))}
          </div>
        </Field>

        <Field label="Activity level" error={errors.activityLevel}>
          <div role="radiogroup" aria-label="Activity level" className="grid gap-2 sm:grid-cols-2">
            {ACTIVITY_LEVELS.map((a) => (
              <OptionTile key={a} kind="radio" selected={f.activityLevel === a} onToggle={() => set("activityLevel", a)}>
                {a}
              </OptionTile>
            ))}
          </div>
        </Field>

        <Field label="Current fitness level" error={errors.fitnessLevel}>
          <div role="radiogroup" aria-label="Fitness level" className="grid gap-2 sm:grid-cols-3">
            {FITNESS_LEVELS.map((a) => (
              <OptionTile key={a} kind="radio" selected={f.fitnessLevel === a} onToggle={() => set("fitnessLevel", a)}>
                {a}
              </OptionTile>
            ))}
          </div>
        </Field>
      </FormSection>

      {/* B */}
      <FormSection
        letter="B"
        title="Medical background"
        description="Share only what you are comfortable with. It helps Baymini keep suggestions safe."
      >
        <Field label="Existing medical conditions" optional>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <OptionTile
              selected={f.noConditions}
              onToggle={() => onChange({ ...f, noConditions: !f.noConditions, conditions: [], otherConditions: "" })}
            >
              None
            </OptionTile>
            {CONDITIONS.map((c) => (
              <OptionTile
                key={c}
                selected={f.conditions.includes(c)}
                onToggle={() => onChange({ ...f, noConditions: false, conditions: toggle(f.conditions, c) })}
              >
                {c}
              </OptionTile>
            ))}
          </div>
          {!f.noConditions ? (
            <Input
              aria-label="Other conditions"
              placeholder="Other conditions (optional)"
              value={f.otherConditions}
              maxLength={300}
              onChange={(e) => set("otherConditions", e.target.value)}
            />
          ) : null}
        </Field>

        <div className="grid gap-6 sm:grid-cols-3">
          <Field label="Allergies" htmlFor="allergies" optional>
            <Input id="allergies" placeholder="Leave blank if none" maxLength={300} value={f.allergies} onChange={(e) => set("allergies", e.target.value)} />
          </Field>
          <Field label="Current medications" htmlFor="meds" optional>
            <Input id="meds" placeholder="Leave blank if none" maxLength={300} value={f.medications} onChange={(e) => set("medications", e.target.value)} />
          </Field>
          <Field label="Previous injuries" htmlFor="injuries" optional>
            <Input id="injuries" placeholder="e.g. knee injury in 2022" maxLength={300} value={f.injuries} onChange={(e) => set("injuries", e.target.value)} />
          </Field>
        </div>

        <Field label="Dietary restrictions" optional>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {DIETARY_RESTRICTIONS.map((d) => (
              <OptionTile key={d} selected={f.dietaryRestrictions.includes(d)} onToggle={() => set("dietaryRestrictions", toggle(f.dietaryRestrictions, d))}>
                {d}
              </OptionTile>
            ))}
          </div>
        </Field>
      </FormSection>

      {/* C */}
      <FormSection letter="C" title="Health goals" description="Choose any that matter to you, then mark one as your primary goal.">
        <Field label="Your goals" error={errors.goals ?? errors.primaryGoal}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {GOALS.map((g) => {
              const selected = f.goals.includes(g.id);
              const primary = f.primaryGoal === g.id;
              return (
                <div
                  key={g.id}
                  data-selected={selected}
                  className={cn(
                    "option-tile flex-col items-stretch gap-3 p-4",
                    primary && "ring-2 ring-leaf/30",
                  )}
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={selected}
                    onClick={() => toggleGoal(g.id)}
                    className="flex items-start justify-between gap-3 text-left focus-visible:outline-none"
                  >
                    <span>
                      <span className="block font-display font-semibold">{g.label}</span>
                      <span className="mt-1 block font-body text-xs text-muted-foreground">{g.blurb}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-0.5 h-5 w-5 shrink-0 rounded-md border",
                        selected ? "border-leaf bg-leaf" : "border-input bg-card",
                      )}
                    />
                  </button>
                  {selected ? (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={primary}
                      onClick={() => set("primaryGoal", g.id)}
                      className={cn(
                        "inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 font-display text-xs font-semibold transition-colors",
                        primary ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Star className="h-3 w-3" strokeWidth={1.8} />
                      {primary ? "Primary goal" : "Set as primary"}
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Field>
      </FormSection>

      {/* D */}
      <FormSection letter="D" title="Dietary preferences" description="Meals will be suggested from everyday foods in your region.">
        <Field label="How do you eat?" error={errors.dietType}>
          <div role="radiogroup" aria-label="Diet type" className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {DIET_TYPES.map((d) => (
              <OptionTile key={d} kind="radio" selected={f.dietType === d} onToggle={() => set("dietType", d)}>
                {d}
              </OptionTile>
            ))}
          </div>
          {f.dietType === "Other" ? (
            <Input aria-label="Describe your diet" placeholder="Describe your dietary preference" maxLength={120} value={f.otherDiet} onChange={(e) => set("otherDiet", e.target.value)} />
          ) : null}
        </Field>

        <Field label="Food budget" error={errors.budget}>
          <div role="radiogroup" aria-label="Food budget" className="grid gap-2 sm:grid-cols-3">
            {BUDGETS.map((b) => (
              <OptionTile key={b} kind="radio" selected={f.budget === b} onToggle={() => set("budget", b)}>
                {b}
              </OptionTile>
            ))}
          </div>
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Food allergies" htmlFor="foodAllergies" optional>
            <Input id="foodAllergies" placeholder="e.g. peanuts, shrimp" maxLength={300} value={f.foodAllergies} onChange={(e) => set("foodAllergies", e.target.value)} />
          </Field>
          <Field label="Food restrictions" htmlFor="foodRestrictions" optional>
            <Input id="foodRestrictions" placeholder="e.g. no red meat" maxLength={300} value={f.foodRestrictions} onChange={(e) => set("foodRestrictions", e.target.value)} />
          </Field>
        </div>
        <Field label="Preferred foods" htmlFor="preferred" optional>
          <Textarea id="preferred" placeholder="Foods you enjoy or eat often" maxLength={300} value={f.preferredFoods} onChange={(e) => set("preferredFoods", e.target.value)} />
        </Field>
      </FormSection>

      {/* E */}
      <section className="soft-card flex flex-col items-center gap-5 p-8 text-center sm:p-10">
        <span className="icon-chip h-12 w-12">
          <Sparkles className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <div>
          <h2 className="text-2xl font-semibold">Ready for your plan?</h2>
          <p className="mt-2 font-body text-muted-foreground">Baymini will write a full-day routine around your answers.</p>
        </div>
        <Button type="submit" size="xl">
          <Sparkles strokeWidth={1.6} /> Generate My Health Plan
        </Button>
        <p className="flex max-w-md items-start gap-2 font-body text-xs text-muted-foreground">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.6} />
          Your answers are sent securely only to create this plan. Baymini does not save them or require an account.
        </p>
      </section>
    </form>
  );
}
