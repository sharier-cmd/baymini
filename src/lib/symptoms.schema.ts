import { z } from "zod";

export const SYMPTOMS = [
  "Headache",
  "Fever",
  "Cough",
  "Sore throat",
  "Fatigue",
  "Dizziness",
  "Nausea",
  "Vomiting",
  "Stomach pain",
  "Diarrhea",
  "Shortness of breath",
  "Chest discomfort",
  "Body aches",
  "Joint pain",
  "Skin rash",
  "Other symptoms",
] as const;

export const symptomIntakeSchema = z
  .object({
    symptoms: z.array(z.enum(SYMPTOMS)).max(SYMPTOMS.length),
    description: z.string().trim().max(1000),
  })
  .refine((d) => d.symptoms.length > 0 || d.description.length >= 3, {
    message: "Select at least one symptom or describe how you feel",
    path: ["symptoms"],
  });

export type SymptomIntake = z.infer<typeof symptomIntakeSchema>;

const str = z.string().trim().min(1).max(600);

export const followUpSchema = z.object({
  questions: z
    .array(
      z.object({
        id: z.string().trim().min(1).max(40),
        question: str,
        type: z.enum(["single_choice", "multiple_choice", "short_text"]),
        options: z.array(z.string().trim().min(1).max(120)).max(8),
      }),
    )
    .min(3)
    .max(8)
    .refine((qs) => qs.every((q) => q.type === "short_text" || q.options.length >= 2), {
      message: "Choice questions need options",
    }),
  emergency: z.object({ isEmergency: z.boolean(), reason: z.string().max(400) }),
});

export type FollowUp = z.infer<typeof followUpSchema>;
export type FollowUpQuestion = FollowUp["questions"][number];

export const answersSchema = z
  .array(z.object({ question: str, answer: z.string().trim().max(600) }))
  .max(10);

export const assessmentInputSchema = z.object({
  intake: symptomIntakeSchema,
  answers: answersSchema,
});

export const URGENCY_LEVELS = ["emergency", "prompt", "routine", "self_care"] as const;

export const assessmentSchema = z.object({
  urgency: z.enum(URGENCY_LEVELS),
  urgencyReason: str,
  summary: str,
  possibleExplanations: z
    .array(z.object({ name: z.string().trim().min(1).max(120), explanation: str }))
    .min(1)
    .max(5),
  selfCare: z.array(str).min(1).max(8),
  whenToSeekHelp: z.array(str).min(1).max(8),
  emergencySigns: z.array(str).min(1).max(8),
});

export type Assessment = z.infer<typeof assessmentSchema>;

const S = { type: "string" } as const;
const SA = { type: "array", items: S } as const;
const obj = (properties: Record<string, unknown>) => ({
  type: "object",
  properties,
  required: Object.keys(properties),
  additionalProperties: false,
});

export const followUpJsonSchema = obj({
  questions: {
    type: "array",
    items: obj({
      id: S,
      question: S,
      type: { type: "string", enum: ["single_choice", "multiple_choice", "short_text"] },
      options: SA,
    }),
  },
  emergency: obj({ isEmergency: { type: "boolean" }, reason: S }),
});

export const assessmentJsonSchema = obj({
  urgency: { type: "string", enum: [...URGENCY_LEVELS] },
  urgencyReason: S,
  summary: S,
  possibleExplanations: { type: "array", items: obj({ name: S, explanation: S }) },
  selfCare: SA,
  whenToSeekHelp: SA,
  emergencySigns: SA,
});
