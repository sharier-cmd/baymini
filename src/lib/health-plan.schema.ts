import { z } from "zod";

export const GENDERS = ["Male", "Female", "Prefer not to say"] as const;
export const ACTIVITY_LEVELS = [
  "Sedentary (mostly sitting)",
  "Lightly active",
  "Moderately active",
  "Very active",
] as const;
export const FITNESS_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
export const CONDITIONS = [
  "Diabetes",
  "High blood pressure",
  "Heart condition",
  "Asthma",
  "Thyroid condition",
  "PCOS",
  "Arthritis",
  "Kidney condition",
  "Digestive condition",
  "Anxiety or depression",
] as const;
export const DIETARY_RESTRICTIONS = [
  "Halal",
  "Kosher",
  "Gluten-free",
  "Lactose-free",
  "Low sodium",
  "Low sugar",
  "No beef",
  "No pork",
] as const;
export const GOALS = [
  { id: "muscle", label: "Muscle building", blurb: "Build strength and lean muscle" },
  { id: "weight", label: "Weight management", blurb: "Reach or keep a healthy weight" },
  { id: "longevity", label: "Longevity and healthy aging", blurb: "Habits for the long run" },
  { id: "wellness", label: "Overall health and wellness", blurb: "Feel better day to day" },
  { id: "sleep", label: "Better sleep", blurb: "Rest deeper, wake refreshed" },
  { id: "stamina", label: "Improved stamina and fitness", blurb: "More energy and endurance" },
  { id: "stress", label: "Stress management", blurb: "Calmer, more balanced days" },
] as const;
export const DIET_TYPES = ["Vegetarian", "Non-vegetarian", "Vegan", "Pescatarian", "Other"] as const;
export const BUDGETS = ["Low", "Moderate", "Flexible"] as const;

const goalIds = GOALS.map((g) => g.id) as [string, ...string[]];
const shortText = (max: number) => z.string().trim().max(max);

export const healthProfileSchema = z
  .object({
    age: z.number().int().min(13, "Baymini is for ages 13 and up").max(100),
    heightCm: z.number().min(100, "Height looks too low").max(250, "Height looks too high"),
    weightKg: z.number().min(25, "Weight looks too low").max(300, "Weight looks too high"),
    gender: z.enum(GENDERS),
    country: shortText(60).min(2, "Please enter your country or region"),
    activityLevel: z.enum(ACTIVITY_LEVELS),
    fitnessLevel: z.enum(FITNESS_LEVELS),
    sleepHours: z.number().min(2).max(14),

    conditions: z.array(z.enum(CONDITIONS)).max(CONDITIONS.length),
    otherConditions: shortText(300),
    allergies: shortText(300),
    medications: shortText(300),
    injuries: shortText(300),
    dietaryRestrictions: z.array(z.enum(DIETARY_RESTRICTIONS)).max(DIETARY_RESTRICTIONS.length),

    goals: z.array(z.enum(goalIds)).min(1, "Pick at least one goal").max(GOALS.length),
    primaryGoal: z.enum(goalIds),

    dietType: z.enum(DIET_TYPES),
    otherDiet: shortText(120),
    foodAllergies: shortText(300),
    foodRestrictions: shortText(300),
    budget: z.enum(BUDGETS),
    preferredFoods: shortText(300),
  })
  .refine((d) => d.goals.includes(d.primaryGoal), {
    message: "Your primary goal must be one of your selected goals",
    path: ["primaryGoal"],
  });

export type HealthProfile = z.infer<typeof healthProfileSchema>;

const str = z.string().trim().min(1).max(1200);
const list = z.array(str).min(1).max(8);

export const healthPlanSchema = z.object({
  intro: str,
  importantNotes: z.array(str).max(6),
  morning: z.object({ wakeUp: str, habits: list, breakfast: str, activity: str }),
  afternoon: z.object({ lunch: str, hydration: str, movement: str, habits: list }),
  evening: z.object({ dinner: str, relaxation: str, recovery: str, sleepPrep: str }),
  diet: z.object({
    meals: z
      .array(
        z.object({
          meal: z.enum(["Breakfast", "Lunch", "Dinner", "Snacks"]),
          items: list,
          portion: str,
          nutritionEstimate: str,
          affordableAlternative: str,
        }),
      )
      .min(4)
      .max(4),
    estimatedDailyIntake: str,
    localFoods: list,
  }),
  exercise: z.object({
    items: z
      .array(z.object({ name: str, duration: str, intensity: str, beginnerAlternative: str }))
      .min(2)
      .max(6),
    restAndRecovery: str,
  }),
  sleepLifestyle: z.object({
    sleepRoutine: str,
    sleepHygiene: list,
    hydration: str,
    stressManagement: list,
    dailyHabits: list,
  }),
  whenToSeeAProfessional: list,
});

export type HealthPlan = z.infer<typeof healthPlanSchema>;

/* Strict JSON schema for the AI model (mirrors healthPlanSchema). */
const S = { type: "string" } as const;
const SA = { type: "array", items: S } as const;
const obj = (properties: Record<string, unknown>) => ({
  type: "object",
  properties,
  required: Object.keys(properties),
  additionalProperties: false,
});

export const healthPlanJsonSchema = obj({
  intro: S,
  importantNotes: SA,
  morning: obj({ wakeUp: S, habits: SA, breakfast: S, activity: S }),
  afternoon: obj({ lunch: S, hydration: S, movement: S, habits: SA }),
  evening: obj({ dinner: S, relaxation: S, recovery: S, sleepPrep: S }),
  diet: obj({
    meals: {
      type: "array",
      items: obj({
        meal: { type: "string", enum: ["Breakfast", "Lunch", "Dinner", "Snacks"] },
        items: SA,
        portion: S,
        nutritionEstimate: S,
        affordableAlternative: S,
      }),
    },
    estimatedDailyIntake: S,
    localFoods: SA,
  }),
  exercise: obj({
    items: {
      type: "array",
      items: obj({ name: S, duration: S, intensity: S, beginnerAlternative: S }),
    },
    restAndRecovery: S,
  }),
  sleepLifestyle: obj({
    sleepRoutine: S,
    sleepHygiene: SA,
    hydration: S,
    stressManagement: SA,
    dailyHabits: SA,
  }),
  whenToSeeAProfessional: SA,
});

export function goalLabel(id: string) {
  return GOALS.find((g) => g.id === id)?.label ?? id;
}
