import type { HealthPlan } from "./health-plan.schema";
import type { Assessment, FollowUp } from "./symptoms.schema";

/**
 * Clearly labeled SAMPLE content shown only when the AI service is not configured.
 * Never presented as real AI-generated guidance.
 */
export const SAMPLE_PLAN: HealthPlan = {
  intro:
    "Sample plan for a 28-year-old in Bangladesh focused on overall health and wellness. It shows the format of a Baymini plan; it is not based on your answers.",
  importantNotes: ["This is sample content for demonstration only."],
  morning: {
    wakeUp: "Wake around 6:30 AM, open the curtains and drink a glass of water.",
    habits: ["Five minutes of gentle stretching", "A short walk in daylight if possible"],
    breakfast: "Two whole-wheat rutis with mixed vegetable bhaji and a boiled egg.",
    activity: "A 20-minute brisk walk at a pace where you can still talk.",
  },
  afternoon: {
    lunch: "One cup of rice, dal, a piece of rui fish curry and a plate of shak.",
    hydration: "Sip water through the afternoon, roughly 2 to 3 glasses.",
    movement: "Stand and walk for 3 to 5 minutes every hour.",
    habits: ["Eat slowly without screens", "Take a short break outdoors"],
  },
  evening: {
    dinner: "Rice or ruti with chicken or lentil curry and seasonal vegetables.",
    relaxation: "Fifteen minutes of light reading or quiet time with family.",
    recovery: "Gentle stretching for the hips and lower back.",
    sleepPrep: "Dim lights and put away screens 45 minutes before bed.",
  },
  diet: {
    meals: [
      { meal: "Breakfast", items: ["Whole-wheat ruti", "Vegetable bhaji", "Boiled egg"], portion: "2 rutis, 1 cup bhaji, 1 egg", nutritionEstimate: "About 400 kcal", affordableAlternative: "Chira with yogurt and banana" },
      { meal: "Lunch", items: ["Rice", "Dal", "Rui fish", "Shak"], portion: "1 cup rice, 1 bowl dal, 1 piece fish", nutritionEstimate: "About 600 kcal", affordableAlternative: "Replace fish with eggs" },
      { meal: "Dinner", items: ["Ruti or rice", "Lentil curry", "Vegetables"], portion: "Moderate plate", nutritionEstimate: "About 500 kcal", affordableAlternative: "Khichuri with vegetables" },
      { meal: "Snacks", items: ["Guava or banana", "Roasted chickpeas"], portion: "1 fruit, a small handful", nutritionEstimate: "About 200 kcal", affordableAlternative: "Seasonal local fruit" },
    ],
    estimatedDailyIntake: "Roughly 1,700 to 1,900 kcal. This is an estimate only.",
    localFoods: ["Rice", "Dal", "Small local fish", "Eggs", "Seasonal shak", "Guava"],
  },
  exercise: {
    items: [
      { name: "Brisk walking", duration: "20 to 30 minutes", intensity: "Moderate", beginnerAlternative: "10 minutes, twice a day" },
      { name: "Bodyweight squats and wall push-ups", duration: "10 minutes", intensity: "Light to moderate", beginnerAlternative: "Chair sit-to-stands" },
    ],
    restAndRecovery: "Take at least one easy day a week and stop if anything hurts.",
  },
  sleepLifestyle: {
    sleepRoutine: "Aim for 7 to 8 hours, going to bed around 10:30 PM.",
    sleepHygiene: ["Keep the room dark and cool", "Avoid tea or coffee after 4 PM"],
    hydration: "About 8 glasses of water across the day, more in hot weather.",
    stressManagement: ["Slow breathing for 3 minutes", "A short evening walk"],
    dailyHabits: ["Regular meal times", "Time outdoors in daylight"],
  },
  whenToSeeAProfessional: ["Before starting a new exercise routine if you have a health condition"],
};

export const SAMPLE_FOLLOW_UP: FollowUp = {
  questions: [
    { id: "duration", question: "How long have you had these symptoms?", type: "single_choice", options: ["Less than a day", "1 to 3 days", "4 to 7 days", "More than a week"] },
    { id: "severity", question: "How severe are they right now?", type: "single_choice", options: ["Mild", "Moderate", "Severe"] },
    { id: "trend", question: "Are they getting better or worse?", type: "single_choice", options: ["Getting better", "About the same", "Getting worse"] },
    { id: "other", question: "Anything else you have noticed?", type: "short_text", options: [] },
  ],
  emergency: { isEmergency: false, reason: "" },
};

export const SAMPLE_ASSESSMENT: Assessment = {
  urgency: "self_care",
  urgencyReason: "Sample result for demonstration only. It is not based on your answers.",
  summary: "This sample shows how Baymini presents symptom guidance.",
  possibleExplanations: [
    { name: "Common viral infection", explanation: "Sample text: mild symptoms like these are sometimes related to a common cold." },
  ],
  selfCare: ["Sample text: rest and drink fluids."],
  whenToSeekHelp: ["Sample text: if symptoms last more than a few days or get worse."],
  emergencySigns: ["Sample text: severe breathing difficulty or chest pain."],
};
