import { createServerFn } from "@tanstack/react-start";

import type { AiResult } from "./ai-result";
import { assessEmergency } from "./emergency";
import {
  assessmentInputSchema,
  assessmentJsonSchema,
  assessmentSchema,
  followUpJsonSchema,
  followUpSchema,
  symptomIntakeSchema,
  type Assessment,
  type FollowUp,
  type SymptomIntake,
} from "./symptoms.schema";

const BASE_RULES = `You are Baymini, a cautious AI health information assistant. You never diagnose, never claim certainty, and never reassure users that potentially serious symptoms are harmless. You always prioritise emergency warning signs. Plain, calm language. No emojis. No markdown symbols.`;

const FOLLOW_UP_PROMPT = `${BASE_RULES}

Task: write exactly 3 targeted follow-up questions that help understand the user's reported symptoms.
- Pick the 3 questions that matter most for the specific symptoms they selected (for example duration, severity, associated symptoms specific to what they reported, relevant history). Do not ask generic questions that ignore their symptoms.
- Prefer "single_choice" or "multiple_choice" with 2-6 short options. Use "short_text" sparingly (options must be an empty array for short_text).
- ids are short snake_case.
- Set emergency.isEmergency true only if what they already reported suggests a possible emergency (e.g. severe chest pain, severe breathing difficulty, stroke signs, loss of consciousness); give a one-sentence reason. Otherwise false with an empty reason.`;

const ASSESS_PROMPT = `${BASE_RULES}

Task: give structured, preliminary guidance based on the symptoms and answers.
- "possibleExplanations": 2 to 4 common possible causes in cautious language ("could be related to", "is sometimes caused by"). Never state a diagnosis.
- "urgency": "emergency" (call emergency services now), "prompt" (seek medical attention within hours to a day), "routine" (book a regular appointment), "self_care" (general self-care may be reasonable while monitoring). When in doubt choose the more urgent level.
- "urgencyReason": one or two sentences explaining the level.
- "summary": 2-3 sentences restating what they shared.
- "selfCare": practical, safe self-care steps. No prescription drugs; over-the-counter mentions only in general terms with "follow the label" and "check with a pharmacist".
- "whenToSeekHelp": when to contact a healthcare professional.
- "emergencySigns": warning signs that mean they should seek emergency care immediately.`;

function intakeText(i: SymptomIntake) {
  return [
    `Selected symptoms: ${i.symptoms.join(", ") || "None selected"}`,
    `Additional description: ${i.description || "None"}`,
  ].join("\n");
}

export const getFollowUpQuestions = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => symptomIntakeSchema.parse(data))
  .handler(async ({ data }): Promise<AiResult<FollowUp>> => {
    const { generateStructured } = await import("./ai.server");
    return generateStructured({
      name: "symptom_follow_up",
      schema: followUpJsonSchema,
      system: FOLLOW_UP_PROMPT,
      user: intakeText(data),
      validator: followUpSchema,
      // Keep exactly three questions even if the model returns extra.
      transform: (raw) => {
        const r = raw as { questions?: unknown[] };
        return Array.isArray(r?.questions) ? { ...r, questions: r.questions.slice(0, 3) } : raw;
      },
    });
  });

export const getSymptomAssessment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => assessmentInputSchema.parse(data))
  .handler(async ({ data }): Promise<AiResult<Assessment>> => {
    const { generateStructured } = await import("./ai.server");
    const answers = data.answers.map((a) => `Q: ${a.question}\nA: ${a.answer || "No answer"}`).join("\n\n");
    const result = await generateStructured({
      name: "symptom_assessment",
      schema: assessmentJsonSchema,
      system: ASSESS_PROMPT,
      user: `${intakeText(data.intake)}\n\nFollow-up answers:\n${answers}`,
      validator: assessmentSchema,
    });

    // Server-side safety net: emergency language always forces the emergency level.
    const red = assessEmergency({
      signs: [],
      symptoms: data.intake.symptoms,
      texts: [data.intake.description, ...data.answers.map((a) => a.answer)],
    });
    if (result.ok && red.isEmergency && result.data.urgency !== "emergency") {
      return {
        ok: true,
        data: {
          ...result.data,
          urgency: "emergency",
          urgencyReason: `You described ${red.reasons.join(", ").toLowerCase()}. This can be a sign of a medical emergency.`,
        },
      };
    }
    return result;
  });
