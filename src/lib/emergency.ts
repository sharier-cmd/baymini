/**
 * Emergency red-flag detection. Runs on the client before any AI step (so
 * emergency guidance is never delayed) and again on the server.
 */
export const EMERGENCY_SIGNS = [
  { id: "chest_pain", label: "Severe chest pain, pressure or tightness" },
  { id: "breathing", label: "Severe difficulty breathing, or unable to speak in full sentences" },
  { id: "stroke", label: "Face drooping, sudden arm or leg weakness, or slurred speech" },
  { id: "unconscious", label: "Fainting, loss of consciousness or unresponsiveness" },
  { id: "seizure", label: "A seizure or convulsions" },
  { id: "bleeding", label: "Heavy bleeding that will not stop, or vomiting or coughing up blood" },
  { id: "headache", label: "Sudden, severe headache unlike any before, or sudden confusion" },
  { id: "allergy", label: "Swelling of the face, lips or throat after an allergen" },
  { id: "self_harm", label: "Thoughts of harming yourself or others" },
] as const;

export type EmergencySignId = (typeof EMERGENCY_SIGNS)[number]["id"];

const TEXT_PATTERNS: { pattern: RegExp; reason: string }[] = [
  { pattern: /\b(severe|crushing|intense|extreme)\s+chest\s+(pain|pressure|tightness)/i, reason: "Severe chest pain" },
  { pattern: /chest\s+pain.{0,40}\b(arm|jaw|sweat|sweating)/i, reason: "Chest pain spreading to arm or jaw" },
  { pattern: /\b(can'?t|cannot|can not|unable to)\s+breathe/i, reason: "Severe breathing difficulty" },
  { pattern: /\b(gasping|choking|blue lips|turning blue)/i, reason: "Severe breathing difficulty" },
  { pattern: /\b(stroke|face\s+droop|drooping\s+face|slurred\s+speech)/i, reason: "Possible signs of stroke" },
  { pattern: /\b(unconscious|passed out|fainted|loss of consciousness|unresponsive|blacked out)/i, reason: "Loss of consciousness" },
  { pattern: /\b(seizure|convulsion)/i, reason: "Seizure" },
  { pattern: /\b(coughing|vomiting)\s+(up\s+)?blood/i, reason: "Coughing or vomiting blood" },
  { pattern: /\b(severe|heavy|uncontrolled)\s+bleeding/i, reason: "Heavy bleeding" },
  { pattern: /\b(throat\s+(is\s+)?closing|swollen\s+throat|anaphyla)/i, reason: "Possible severe allergic reaction" },
  { pattern: /\b(worst headache|thunderclap)/i, reason: "Sudden severe headache" },
  { pattern: /\b(suicid|kill myself|end my life|self[-\s]?harm|hurt myself)/i, reason: "Thoughts of self-harm" },
];

export function detectEmergencyText(text: string): string[] {
  if (!text.trim()) return [];
  const reasons = new Set<string>();
  for (const { pattern, reason } of TEXT_PATTERNS) {
    if (pattern.test(text)) reasons.add(reason);
  }
  return [...reasons];
}

export function assessEmergency(input: { signs: readonly string[]; texts: readonly string[] }) {
  const reasons: string[] = [];
  for (const id of input.signs) {
    const sign = EMERGENCY_SIGNS.find((s) => s.id === id);
    if (sign) reasons.push(sign.label);
  }
  for (const t of input.texts) {
    for (const r of detectEmergencyText(t)) if (!reasons.includes(r)) reasons.push(r);
  }
  return { isEmergency: reasons.length > 0, reasons };
}
