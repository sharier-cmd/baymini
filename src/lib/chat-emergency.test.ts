import { describe, expect, it } from "vitest";

import { chatInputSchema } from "./chat.schema";
import { detectChatEmergency } from "./emergency";

describe("Baymini chat emergency detection", () => {
  it("flags plain chest pain", () => {
    expect(detectChatEmergency("I have chest pain when I walk")).toContain("Chest pain or discomfort");
  });

  it("flags difficulty breathing", () => {
    expect(detectChatEmergency("I'm having difficulty breathing tonight")).toContain("Difficulty breathing");
  });

  it("flags shortness of breath", () => {
    expect(detectChatEmergency("feeling short of breath")).toContain("Difficulty breathing");
  });

  it("does not flag an everyday wellness question", () => {
    expect(detectChatEmergency("What should I eat for breakfast in Dhaka?")).toEqual([]);
  });
});

describe("chat input", () => {
  it("rejects a conversation that does not end with the visitor's message", () => {
    const r = chatInputSchema.safeParse({ turns: [{ role: "assistant", text: "Hello" }] });
    expect(r.success).toBe(false);
  });
});
