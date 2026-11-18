import { z } from "zod";

export const CHAT_MAX_CHARS = 1500;
export const CHAT_MAX_TURNS = 30;

export const chatTurnSchema = z.object({
  role: z.enum(["user", "assistant"]),
  text: z.string().trim().min(1).max(4000),
});

/** Full conversation so far; the last turn is always the visitor's new message. */
export const chatInputSchema = z.object({
  turns: z
    .array(chatTurnSchema)
    .min(1)
    .max(CHAT_MAX_TURNS)
    .refine((t) => t[t.length - 1]?.role === "user", "Last message must be from the visitor")
    .refine((t) => (t[t.length - 1]?.text.length ?? 0) <= CHAT_MAX_CHARS, "Message is too long"),
});

export type ChatInput = z.infer<typeof chatInputSchema>;
export type ChatReply = { reply: string; emergencyReasons: string[] };
