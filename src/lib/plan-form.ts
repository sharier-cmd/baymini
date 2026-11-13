import type { z } from "zod";

import {
  healthProfileSchema,
  type HealthProfile,
  type ACTIVITY_LEVELS,
  type BUDGETS,
  type CONDITIONS,
  type DIET_TYPES,
  type DIETARY_RESTRICTIONS,
  type FITNESS_LEVELS,
  type GENDERS,
} from "./health-plan.schema";

/** Raw, editable form state (numbers kept as strings while typing). */
export type PlanFormState = {
  age: string;
  heightUnit: "cm" | "ft/in";
  heightCm: string;
  heightFt: string;
  heightIn: string;
  weightUnit: "kg" | "lbs";
  weight: string;
  gender: (typeof GENDERS)[number] | "";
  country: string;
  activityLevel: (typeof ACTIVITY_LEVELS)[number] | "";
  fitnessLevel: (typeof FITNESS_LEVELS)[number] | "";
  sleepHours: string;
  conditions: (typeof CONDITIONS)[number][];
  noConditions: boolean;
  otherConditions: string;
  allergies: string;
  medications: string;
  injuries: string;
  dietaryRestrictions: (typeof DIETARY_RESTRICTIONS)[number][];
  goals: string[];
  primaryGoal: string;
  dietType: (typeof DIET_TYPES)[number] | "";
  otherDiet: string;
  foodAllergies: string;
  foodRestrictions: string;
  budget: (typeof BUDGETS)[number] | "";
  preferredFoods: string;
};

export const emptyPlanForm: PlanFormState = {
  age: "",
  heightUnit: "cm",
  heightCm: "",
  heightFt: "",
  heightIn: "",
  weightUnit: "kg",
  weight: "",
  gender: "",
  country: "",
  activityLevel: "",
  fitnessLevel: "",
  sleepHours: "",
  conditions: [],
  noConditions: false,
  otherConditions: "",
  allergies: "",
  medications: "",
  injuries: "",
  dietaryRestrictions: [],
  goals: [],
  primaryGoal: "",
  dietType: "",
  otherDiet: "",
  foodAllergies: "",
  foodRestrictions: "",
  budget: "",
  preferredFoods: "",
};

const num = (s: string) => (s.trim() === "" ? Number.NaN : Number(s));

export function toHeightCm(f: Pick<PlanFormState, "heightUnit" | "heightCm" | "heightFt" | "heightIn">) {
  if (f.heightUnit === "cm") return num(f.heightCm);
  const ft = num(f.heightFt);
  const inches = f.heightIn.trim() === "" ? 0 : num(f.heightIn);
  return Math.round((ft * 12 + inches) * 2.54 * 10) / 10;
}

export function toWeightKg(f: Pick<PlanFormState, "weightUnit" | "weight">) {
  const w = num(f.weight);
  return f.weightUnit === "kg" ? w : Math.round(w * 0.453592 * 10) / 10;
}

export type PlanFormErrors = Partial<Record<keyof HealthProfile, string>>;

const REQUIRED_MSG: Partial<Record<keyof HealthProfile, string>> = {
  age: "Please enter your age",
  heightCm: "Please enter your height",
  weightKg: "Please enter your weight",
  gender: "Please choose an option",
  activityLevel: "Please choose your activity level",
  fitnessLevel: "Please choose your fitness level",
  sleepHours: "Please enter your average sleep",
  dietType: "Please choose a dietary preference",
  budget: "Please choose a food budget",
  primaryGoal: "Pick a primary goal",
};

export function validatePlanForm(
  f: PlanFormState,
): { ok: true; profile: HealthProfile } | { ok: false; errors: PlanFormErrors } {
  const candidate = {
    age: num(f.age),
    heightCm: toHeightCm(f),
    weightKg: toWeightKg(f),
    gender: f.gender || undefined,
    country: f.country,
    activityLevel: f.activityLevel || undefined,
    fitnessLevel: f.fitnessLevel || undefined,
    sleepHours: num(f.sleepHours),
    conditions: f.noConditions ? [] : f.conditions,
    otherConditions: f.noConditions ? "" : f.otherConditions,
    allergies: f.allergies,
    medications: f.medications,
    injuries: f.injuries,
    dietaryRestrictions: f.dietaryRestrictions,
    goals: f.goals,
    primaryGoal: f.primaryGoal || undefined,
    dietType: f.dietType || undefined,
    otherDiet: f.dietType === "Other" ? f.otherDiet : "",
    foodAllergies: f.foodAllergies,
    foodRestrictions: f.foodRestrictions,
    budget: f.budget || undefined,
    preferredFoods: f.preferredFoods,
  };
  const r = healthProfileSchema.safeParse(candidate);
  if (r.success) return { ok: true, profile: r.data };
  return { ok: false, errors: toErrors(r.error) };
}

function toErrors(error: z.ZodError): PlanFormErrors {
  const out: PlanFormErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof HealthProfile | undefined;
    if (!key || out[key]) continue;
    const isMissing =
      issue.code === "invalid_type" ||
      (issue.code === "invalid_enum_value" && issue.received === undefined) ||
      issue.message.toLowerCase().includes("nan");
    out[key] = isMissing ? (REQUIRED_MSG[key] ?? issue.message) : issue.message;
  }
  return out;
}
