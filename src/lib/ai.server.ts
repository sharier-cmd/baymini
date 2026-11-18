import type { z } from "zod";

import type { AiResult } from "./ai-result";

/**
 * Server-only Google Gemini client. The GEMINI_API_KEY secret is read inside
 * the request and never reaches the browser.
 */
// gemini-2.5-flash is the requested model. Google no longer offers it to new
// API keys (it returns 404), so we fall back to the closest current Flash model.
const MODELS = ["gemini-2.5-flash", "gemini-3.5-flash"] as const;
const endpoint = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
const TIMEOUT_MS = 120_000;

type JsonSchema = Record<string, unknown>;

/** Converts our strict JSON schema into Gemini's OpenAPI-style responseSchema. */
export function toGeminiSchema(schema: unknown): unknown {
  if (Array.isArray(schema)) return schema.map(toGeminiSchema);
  if (!schema || typeof schema !== "object") return schema;
  const src = schema as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(src)) {
    if (key === "additionalProperties") continue;
    if (key === "type" && typeof value === "string") out["type"] = value.toUpperCase();
    else if (key === "properties" && value && typeof value === "object") {
      const props: Record<string, unknown> = {};
      for (const [p, v] of Object.entries(value)) props[p] = toGeminiSchema(v);
      out["properties"] = props;
      out["propertyOrdering"] = Object.keys(value);
    } else out[key] = toGeminiSchema(value);
  }
  return out;
}

type GeminiResponse = {
  candidates?: {
    content?: { parts?: { text?: string; thought?: boolean }[] };
    finishReason?: string;
  }[];
  promptFeedback?: { blockReason?: string };
};

/**
 * Calls Gemini with a JSON response schema and validates the output with zod.
 * Never logs user input: health details stay out of server logs.
 */
export async function generateStructured<T>(opts: {
  name: string;
  schema: JsonSchema;
  system: string;
  user: string;
  validator: z.ZodType<T>;
  transform?: (raw: unknown) => unknown;
}): Promise<AiResult<T>> {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) {
    return { ok: false, code: "not_configured", message: "Baymini's AI service is not set up for this site yet." };
  }

  const signal = AbortSignal.timeout(TIMEOUT_MS);
  const responseSchema = toGeminiSchema(opts.schema);
  let res: Response | undefined;
  try {
    for (const model of MODELS) {
      res = await fetch(endpoint(model), {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: opts.system }] },
          contents: [{ role: "user", parts: [{ text: opts.user }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema,
            temperature: 0.6,
            maxOutputTokens: 16384,
            thinkingConfig: model.startsWith("gemini-2.5") ? { thinkingBudget: 0 } : { thinkingLevel: "low" },
          },
        }),
        signal,
      });
      if (res.status !== 404) break;
    }
  } catch (error) {
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      return { ok: false, code: "timeout", message: "The AI took too long to respond. Please try again." };
    }
    console.error("Gemini request failed", error instanceof Error ? error.name : "unknown");
    return unavailable();
  }

  if (!res) return unavailable();
  if (!res.ok) return mapHttpError(res.status, await res.text().catch(() => ""));

  let body: GeminiResponse;
  try {
    body = (await res.json()) as GeminiResponse;
  } catch {
    return { ok: false, code: "invalid_output", message: "The AI response was incomplete. Please try again." };
  }

  const candidate = body.candidates?.[0];
  const finish = candidate?.finishReason ?? "";
  if (body.promptFeedback?.blockReason || ["SAFETY", "PROHIBITED_CONTENT", "BLOCKLIST", "SPII"].includes(finish)) {
    return {
      ok: false,
      code: "refused",
      message: "The AI declined to answer this request. Please review your input and try again.",
    };
  }

  const text = (candidate?.content?.parts ?? [])
    .filter((p) => !p.thought && typeof p.text === "string")
    .map((p) => p.text)
    .join("");
  if (!text) {
    return { ok: false, code: "invalid_output", message: "The AI returned an empty response. Please try again." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, code: "invalid_output", message: "The AI response was incomplete. Please try again." };
  }

  const result = opts.validator.safeParse(opts.transform ? opts.transform(parsed) : parsed);
  if (!result.success) {
    console.error("Gemini output failed validation", opts.name, result.error.issues.slice(0, 3).map((i) => i.path.join(".")));
    return {
      ok: false,
      code: "invalid_output",
      message: "The AI response did not pass our safety and format checks. Please try again.",
    };
  }
  return { ok: true, data: result.data };
}

export type ChatTurn = { role: "user" | "assistant"; text: string };

/**
 * Multi-turn plain-text chat with Gemini. Same key handling, model fallback
 * and error mapping as generateStructured. Never logs the conversation.
 */
export async function generateChatReply(opts: { system: string; turns: ChatTurn[] }): Promise<AiResult<string>> {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) {
    return { ok: false, code: "not_configured", message: "Baymini's AI service is not set up for this site yet." };
  }
  const signal = AbortSignal.timeout(60_000);
  const contents = opts.turns.map((t) => ({ role: t.role === "assistant" ? "model" : "user", parts: [{ text: t.text }] }));
  let res: Response | undefined;
  try {
    for (const model of MODELS) {
      res = await fetch(endpoint(model), {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: opts.system }] },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
            thinkingConfig: model.startsWith("gemini-2.5") ? { thinkingBudget: 0 } : { thinkingLevel: "low" },
          },
        }),
        signal,
      });
      if (res.status !== 404) break;
    }
  } catch (error) {
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      return { ok: false, code: "timeout", message: "Baymini took too long to reply. Please try again." };
    }
    console.error("Gemini chat request failed", error instanceof Error ? error.name : "unknown");
    return unavailable();
  }
  if (!res) return unavailable();
  if (!res.ok) return mapHttpError(res.status, await res.text().catch(() => ""));

  let body: GeminiResponse;
  try {
    body = (await res.json()) as GeminiResponse;
  } catch {
    return { ok: false, code: "invalid_output", message: "Baymini's reply was incomplete. Please try again." };
  }
  const candidate = body.candidates?.[0];
  const finish = candidate?.finishReason ?? "";
  if (body.promptFeedback?.blockReason || ["SAFETY", "PROHIBITED_CONTENT", "BLOCKLIST", "SPII"].includes(finish)) {
    return { ok: false, code: "refused", message: "Baymini can't help with that request. Please try asking in a different way." };
  }
  const text = (candidate?.content?.parts ?? [])
    .filter((p) => !p.thought && typeof p.text === "string")
    .map((p) => p.text)
    .join("")
    .trim();
  if (!text) {
    return { ok: false, code: "invalid_output", message: "Baymini returned an empty reply. Please try again." };
  }
  return { ok: true, data: text };
}

function unavailable(): AiResult<never> {
  return { ok: false, code: "unavailable", message: "Baymini's AI is temporarily unavailable. Please try again shortly." };
}

function mapHttpError(status: number, body: string): AiResult<never> {
  console.error("Gemini HTTP error", { status });
  if (status === 401 || status === 403 || (status === 400 && /API_KEY|API key/i.test(body))) {
    return { ok: false, code: "not_configured", message: "Baymini's AI key is missing or not valid." };
  }
  if (status === 429) {
    return { ok: false, code: "rate_limited", message: "Baymini is receiving a lot of requests. Please wait a minute and try again." };
  }
  if (status === 408 || status === 504) {
    return { ok: false, code: "timeout", message: "The AI took too long to respond. Please try again." };
  }
  return unavailable();
}
