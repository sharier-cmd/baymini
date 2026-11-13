/** Shared result shape returned by every AI server function (client-safe). */
export type AiErrorCode =
  | "not_configured"
  | "rate_limited"
  | "credits"
  | "timeout"
  | "refused"
  | "invalid_output"
  | "unavailable"
  | "invalid_input";

export type AiResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: AiErrorCode; message: string };
