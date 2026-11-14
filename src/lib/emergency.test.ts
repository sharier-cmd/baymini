import { describe, expect, it } from "vitest";

import { assessEmergency, detectEmergencyText } from "./emergency";

describe("emergency detection", () => {
  it("flags any ticked emergency sign immediately", () => {
    const r = assessEmergency({ signs: ["chest_pain"], texts: [] });
    expect(r.isEmergency).toBe(true);
  });

  it("flags severe chest pain described in free text", () => {
    expect(detectEmergencyText("I have severe chest pain since an hour")).toContain("Severe chest pain");
  });

  it("flags breathing difficulty described in free text", () => {
    expect(detectEmergencyText("I can't breathe properly")).toContain("Severe breathing difficulty");
  });

  it("flags signs of stroke", () => {
    expect(detectEmergencyText("my dad has slurred speech")).toContain("Possible signs of stroke");
  });

  it("flags loss of consciousness", () => {
    expect(detectEmergencyText("she passed out this morning")).toContain("Loss of consciousness");
  });

  it("flags self-harm thoughts", () => {
    expect(assessEmergency({ signs: [], texts: ["I want to end my life"] }).isEmergency).toBe(true);
  });

  it("flags chest discomfort selected as a symptom", () => {
    expect(assessEmergency({ signs: [], texts: [], symptoms: ["Chest discomfort"] }).isEmergency).toBe(true);
  });

  it("flags shortness of breath selected as a symptom", () => {
    expect(assessEmergency({ signs: [], texts: [], symptoms: ["Shortness of breath"] }).isEmergency).toBe(true);
  });

  it("does not flag a mild selected symptom such as headache", () => {
    expect(assessEmergency({ signs: [], texts: [], symptoms: ["Headache", "Fever"] }).isEmergency).toBe(false);
  });

  it("does not flag a common mild symptom description", () => {
    expect(assessEmergency({ signs: [], texts: ["mild headache and a runny nose for two days"] }).isEmergency).toBe(false);
  });
});
