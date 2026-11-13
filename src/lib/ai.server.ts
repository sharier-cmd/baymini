import {
  CancelledError,
  ConfigurationError,
  AuthenticationError,
  GatewayError,
  PaymentRequiredError,
  RateLimitError,
  TimeoutError,
  generateResponse,
} from "@lovable.dev/ai-gateway";
import type { z } from "zod";

import type { AiResult } from "./ai-result";

const MODEL = "openai/gpt-6-astra" as const;
const TIMEOUT_MS = 120_000;

type JsonSchema = Record<string, unknown>;

/**
 * Calls the AI model with a strict JSON schema and validates the output with zod.
 * Never logs user input: health details stay out of server logs.
 */
export async function generateStructured<T>(opts: {
  name: string;
  schema: JsonSchema;
  system: string;
  user: string;
  validator: z.ZodType<T>;
}): Promise<AiResult<T>> {
  let response;
  try {
    response = await generateResponse(
      {
        model: MODEL,
        instructions: opts.system,
        input: [{ role: "user", content: opts.user }],
        reasoning: { effort: "low" },
        text: {
          format: { type: "json_schema", name: opts.name, schema: opts.schema, strict: true },
        },
      },
      { signal: AbortSignal.timeout(TIMEOUT_MS) },
    );
  } catch (error) {
    return mapError(error);
  }

  let text = "";
  for (const item of response.output ?? []) {
    if (item.type !== "message") continue;
    for (const part of item.content) {
      if (part.type === "refusal") {
        return {
          ok: false,
          code: "refused",
          message: "The AI declined to answer this request. Please review your input and try again.",
        };
      }
      if (part.type === "output_text") text += part.text;
    }
  }

  if (!text) {
    return { ok: false, code: "invalid_output", message: "The AI returned an empty response. Please try again." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, code: "invalid_output", message: "The AI response was incomplete. Please try again." };
  }

  const result = opts.validator.safeParse(parsed);
  if (!result.success) {
    return {
      ok: false,
      code: "invalid_output",
      message: "The AI response did not pass our safety and format checks. Please try again.",
    };
  }
  return { ok: true, data: result.data };
}

function mapError(error: unknown): AiResult<never> {
  if (error instanceof ConfigurationError || error instanceof AuthenticationError) {
    return {
      ok: false,
      code: "not_configured",
      message: "Baymini's AI service is not set up for this site yet.",
    };
  }
  if (error instanceof RateLimitError) {
    return { ok: false, code: "rate_limited", message: "Baymini is receiving a lot of requests. Please wait a minute and try again." };
  }
  if (error instanceof PaymentRequiredError) {
    return { ok: false, code: "credits", message: "Baymini's AI usage limit has been reached. Please try again later." };
  }
  if (error instanceof TimeoutError || error instanceof CancelledError || isAbort(error)) {
    return { ok: false, code: "timeout", message: "The AI took too long to respond. Please try again." };
  }
  if (error instanceof GatewayError) {
    console.error("AI gateway error", { code: error.code, status: error.httpStatus });
  } else {
    console.error("AI call failed", error instanceof Error ? error.name : "unknown");
  }
  return { ok: false, code: "unavailable", message: "Baymini's AI is temporarily unavailable. Please try again shortly." };
}

function isAbort(error: unknown) {
  return error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError");
}
