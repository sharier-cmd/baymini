import { describe, expect, it } from "vitest";

import { emptyPlanForm, toHeightCm, toWeightKg, validatePlanForm, type PlanFormState } from "./plan-form";

const valid: PlanFormState = {
  ...emptyPlanForm,
  age: "28",
  heightCm: "170",
  weight: "65",
  gender: "Prefer not to say",
  country: "Bangladesh",
  activityLevel: "Lightly active",
  fitnessLevel: "Beginner",
  sleepHours: "7",
  goals: ["wellness", "sleep"],
  primaryGoal: "sleep",
  dietType: "Non-vegetarian",
  budget: "Low",
};

describe("health plan form", () => {
  it("converts 5 ft 7 in to about 170 cm", () => {
    expect(toHeightCm({ heightUnit: "ft/in", heightCm: "", heightFt: "5", heightIn: "7" })).toBe(170.2);
  });

  it("converts 150 lbs to about 68 kg", () => {
    expect(toWeightKg({ weightUnit: "lbs", weight: "150" })).toBe(68);
  });

  it("accepts a complete profile", () => {
    expect(validatePlanForm(valid).ok).toBe(true);
  });

  it("requires at least one goal", () => {
    const r = validatePlanForm({ ...valid, goals: [], primaryGoal: "" });
    expect(r.ok).toBe(false);
  });

  it("requires the primary goal to be one of the selected goals", () => {
    const r = validatePlanForm({ ...valid, primaryGoal: "muscle" });
    expect(r.ok === false && r.errors.primaryGoal).toBeTruthy();
  });

  it("rejects ages under 13", () => {
    const r = validatePlanForm({ ...valid, age: "10" });
    expect(r.ok === false && r.errors.age).toBeTruthy();
  });

  it("clears listed conditions when 'none' is chosen", () => {
    const r = validatePlanForm({ ...valid, conditions: ["Diabetes"], noConditions: true });
    expect(r.ok && r.profile.conditions).toEqual([]);
  });
});
