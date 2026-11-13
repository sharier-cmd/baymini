import { createServerFn } from "@tanstack/react-start";

import type { AiResult } from "./ai-result";
import {
  goalLabel,
  healthPlanJsonSchema,
  healthPlanSchema,
  healthProfileSchema,
  type HealthPlan,
  type HealthProfile,
} from "./health-plan.schema";

const SYSTEM_PROMPT = `You are Baymini, a careful wellness assistant that writes general, personalized daily lifestyle plans. You are not a doctor and this is not a prescription.

Safety rules (always follow):
- Take the user's medical conditions, allergies, medications and injuries into account. Never include foods they are allergic to or have restricted.
- No extreme or unsafe diets, no very low calorie targets, no fasting regimes for people with diabetes, eating concerns or medications that interact with fasting.
- Do not recommend supplements unless commonly safe (e.g. drinking water) and never as a treatment. Do not recommend prescription changes.
- If conditions such as heart disease, high blood pressure, diabetes, kidney disease, asthma, pregnancy or injuries are present, keep exercise gentle to moderate and say to confirm with their doctor before increasing intensity.
- Never claim the plan treats, cures or reverses any condition. No longevity or anti-aging promises.
- Calories and nutrition are rough estimates only; say so with words like "about" or "roughly".
- Plain, warm, practical language. No emojis. No markdown symbols.

Local food personalization:
- Build meals around everyday, affordable foods common in the user's country or region (e.g. Bangladesh: rice, dal, fish, eggs, seasonal vegetables, local fruit).
- Respect diet type, budget, preferred foods and dietary restrictions. Avoid expensive or hard-to-find ingredients when affordable local options exist.

Output:
- "intro": 2-3 sentences tied to the primary goal.
- "importantNotes": short safety notes specific to their medical background (empty array if none apply).
- Exactly 4 meals in diet.meals in order Breakfast, Lunch, Dinner, Snacks.
- 2 to 5 exercises. Lists have 2 to 6 short items.
- "whenToSeeAProfessional": specific situations when they should consult a healthcare professional.`;

function describeProfile(p: HealthProfile) {
  const lines = [
    `Age: ${p.age}`,
    `Height: ${Math.round(p.heightCm)} cm`,
    `Weight: ${Math.round(p.weightKg)} kg`,
    `Gender: ${p.gender}`,
    `Country/region: ${p.country}`,
    `Activity level: ${p.activityLevel}`,
    `Fitness level: ${p.fitnessLevel}`,
    `Average sleep: ${p.sleepHours} hours`,
    `Medical conditions: ${[...p.conditions, p.otherConditions].filter(Boolean).join(", ") || "None reported"}`,
    `Allergies: ${p.allergies || "None reported"}`,
    `Current medications: ${p.medications || "None reported"}`,
    `Previous injuries: ${p.injuries || "None reported"}`,
    `Dietary restrictions: ${p.dietaryRestrictions.join(", ") || "None"}`,
    `Goals: ${p.goals.map(goalLabel).join(", ")}`,
    `Primary goal: ${goalLabel(p.primaryGoal)}`,
    `Diet type: ${p.dietType}${p.otherDiet ? ` (${p.otherDiet})` : ""}`,
    `Food allergies: ${p.foodAllergies || "None reported"}`,
    `Food restrictions: ${p.foodRestrictions || "None"}`,
    `Food budget: ${p.budget}`,
    `Preferred foods: ${p.preferredFoods || "No preference given"}`,
  ];
  return `Create my personalized daily health plan.\n\n${lines.join("\n")}`;
}

export const generateHealthPlan = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => healthProfileSchema.parse(data))
  .handler(async ({ data }): Promise<AiResult<HealthPlan>> => {
    const { generateStructured } = await import("./ai.server");
    return generateStructured({
      name: "health_plan",
      schema: healthPlanJsonSchema,
      system: SYSTEM_PROMPT,
      user: describeProfile(data),
      validator: healthPlanSchema,
    });
  });
