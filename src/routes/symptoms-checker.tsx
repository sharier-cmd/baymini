import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { AiErrorCard, SampleBanner } from "@/components/site/AiStatus";
import { Disclaimer } from "@/components/site/Disclaimer";
import { GeneratingScreen } from "@/components/site/GeneratingScreen";
import { PageHeading } from "@/components/site/PageHeading";
import { AssessmentView } from "@/components/symptoms/AssessmentView";
import { EmergencyPanel } from "@/components/symptoms/EmergencyPanel";
import { FollowUpForm, type Answers } from "@/components/symptoms/FollowUpForm";
import { SymptomIntake, type IntakeState } from "@/components/symptoms/SymptomIntake";
import type { AiErrorCode } from "@/lib/ai-result";
import { assessEmergency, severeSymptomsIn } from "@/lib/emergency";
import { SAMPLE_ASSESSMENT, SAMPLE_FOLLOW_UP } from "@/lib/sample-data";
import { getFollowUpQuestions, getSymptomAssessment } from "@/lib/symptoms.functions";
import { symptomIntakeSchema, type Assessment, type FollowUp, type SymptomIntake as Intake } from "@/lib/symptoms.schema";

export const Route = createFileRoute("/symptoms-checker")({
  head: () => ({
    meta: [
      { title: "Symptoms Checker — Baymini" },
      {
        name: "description",
        content:
          "Select your symptoms, answer a few AI-tailored questions and get cautious, preliminary guidance on possible causes and next steps.",
      },
      { property: "og:title", content: "Symptoms Checker — Baymini" },
      { property: "og:description", content: "AI-assisted preliminary symptom guidance with clear urgency levels and emergency warnings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SymptomsPage,
});

type Step =
  | { kind: "intake" }
  | { kind: "emergency"; reasons: string[] }
  | { kind: "loading-questions" }
  | { kind: "questions"; followUp: FollowUp }
  | { kind: "loading-result"; followUp: FollowUp }
  | { kind: "result"; followUp: FollowUp; assessment: Assessment }
  | { kind: "error"; code: AiErrorCode; message: string; retry: () => void; sample: () => void };

const emptyIntake: IntakeState = { emergencySigns: [], symptoms: [], description: "" };

function SymptomsPage() {
  const [intake, setIntake] = useState<IntakeState>(emptyIntake);
  const [intakeError, setIntakeError] = useState<string>();
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState<Step>({ kind: "intake" });
  const [isSample, setIsSample] = useState(false);
  const [answerRedFlags, setAnswerRedFlags] = useState<string[]>([]);
  const severe = severeSymptomsIn(intake.symptoms);
  const fetchQuestions = useServerFn(getFollowUpQuestions);
  const fetchAssessment = useServerFn(getSymptomAssessment);

  const top = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const networkError = "We couldn't reach Baymini. Check your connection and try again.";

  async function loadQuestions(data: Intake) {
    setStep({ kind: "loading-questions" });
    setIsSample(false);
    top();
    try {
      const res = await fetchQuestions({ data });
      if (res.ok) {
        setAnswers({});
        setStep({ kind: "questions", followUp: res.data });
      } else {
        setStep({
          kind: "error",
          code: res.code,
          message: res.message,
          retry: () => void loadQuestions(data),
          sample: () => {
            setIsSample(true);
            setAnswers({});
            setStep({ kind: "questions", followUp: SAMPLE_FOLLOW_UP });
          },
        });
      }
    } catch {
      setStep({ kind: "error", code: "unavailable", message: networkError, retry: () => void loadQuestions(data), sample: () => {} });
    }
  }

  function handleContinue() {
    // Emergency check first: never wait on AI when red flags are present.
    const red = assessEmergency({ signs: intake.emergencySigns, texts: [intake.description] });
    if (red.isEmergency) {
      setStep({ kind: "emergency", reasons: red.reasons });
      top();
      return;
    }
    const parsed = symptomIntakeSchema.safeParse({ symptoms: intake.symptoms, description: intake.description });
    if (!parsed.success) {
      setIntakeError(parsed.error.issues[0]?.message ?? "Please select at least one symptom");
      return;
    }
    setIntakeError(undefined);
    void loadQuestions(parsed.data);
  }

  async function loadAssessment(followUp: FollowUp) {
    const list = followUp.questions.map((q) => {
      const a = answers[q.id];
      return { question: q.question, answer: Array.isArray(a) ? a.join(", ") : (a ?? "") };
    });
    const red = assessEmergency({ signs: [], texts: list.map((l) => l.answer) });
    setAnswerRedFlags(red.reasons);

    if (isSample) {
      setStep({ kind: "result", followUp, assessment: SAMPLE_ASSESSMENT });
      top();
      return;
    }

    setStep({ kind: "loading-result", followUp });
    top();
    const data = { intake: { symptoms: intake.symptoms, description: intake.description }, answers: list };
    try {
      const res = await fetchAssessment({ data });
      if (res.ok) {
        setStep({ kind: "result", followUp, assessment: res.data });
      } else {
        setStep({
          kind: "error",
          code: res.code,
          message: res.message,
          retry: () => void loadAssessment(followUp),
          sample: () => {
            setIsSample(true);
            setStep({ kind: "result", followUp, assessment: SAMPLE_ASSESSMENT });
          },
        });
      }
    } catch {
      setStep({ kind: "error", code: "unavailable", message: networkError, retry: () => void loadAssessment(followUp), sample: () => {} });
    }
  }

  function restart() {
    setIntake(emptyIntake);
    setAnswers({});
    setAnswerRedFlags([]);
    setIsSample(false);
    setStep({ kind: "intake" });
    top();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-8 pt-12 sm:pt-16">
      <PageHeading eyebrow="Symptoms Checker" title="Let's understand how you're feeling.">
        Select the symptoms you're experiencing. Baymini will ask a few additional questions to help
        you understand possible explanations and appropriate next steps.
      </PageHeading>
      <Disclaimer className="mt-6" />

      <div className="mt-10">
        {isSample && (step.kind === "questions" || step.kind === "result") ? (
          <div className="mb-5">
            <SampleBanner />
          </div>
        ) : null}

        {step.kind === "intake" ? (
          <SymptomIntake value={intake} onChange={setIntake} onContinue={handleContinue} error={intakeError} />
        ) : null}

        {step.kind === "emergency" ? (
          <div className="space-y-5">
            <EmergencyPanel reasons={step.reasons} />
            <button
              type="button"
              onClick={() => setStep({ kind: "intake" })}
              className="font-display text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              Go back and edit what I entered
            </button>
          </div>
        ) : null}

        {step.kind === "loading-questions" ? (
          <div className="space-y-5">
          {severe.length > 0 ? <EmergencyPanel reasons={severe} compact /> : null}
          <GeneratingScreen
            title="Preparing your questions"
            stages={[
              { label: "Checked for emergency warning signs", state: "done" },
              { label: "Baymini AI is choosing relevant questions", state: "active" },
            ]}
          />
          </div>
        ) : null}

        {step.kind === "questions" ? (
          <div className="space-y-5">
            {step.followUp.emergency.isEmergency || severe.length > 0 ? (
              <EmergencyPanel
                reasons={[...severe, ...(step.followUp.emergency.reason ? [step.followUp.emergency.reason] : [])]}
                compact
              />
            ) : null}
            <FollowUpForm
              questions={step.followUp.questions}
              answers={answers}
              onChange={setAnswers}
              onBack={() => setStep({ kind: "intake" })}
              onSubmit={() => void loadAssessment(step.followUp)}
            />
          </div>
        ) : null}

        {step.kind === "loading-result" ? (
          <div className="space-y-5">
            {answerRedFlags.length > 0 || severe.length > 0 ? (
              <EmergencyPanel reasons={[...severe, ...answerRedFlags]} />
            ) : null}
            <GeneratingScreen
              title="Reviewing your answers"
              stages={[
                { label: "Checked your answers for emergency warning signs", state: "done" },
                { label: "Baymini AI is preparing your guidance", state: "active" },
              ]}
            />
          </div>
        ) : null}

        {step.kind === "result" ? (
          <div className="space-y-5">
            {answerRedFlags.length > 0 || severe.length > 0 || step.assessment.urgency === "emergency" ? (
              <EmergencyPanel reasons={[...severe, ...answerRedFlags]} />
            ) : null}
            <AssessmentView
              assessment={step.assessment}
              onEdit={() => setStep({ kind: "questions", followUp: step.followUp })}
              onRestart={restart}
            />
          </div>
        ) : null}

        {step.kind === "error" ? (
          <div className="space-y-4">
            <AiErrorCard code={step.code} message={step.message} onRetry={step.retry} onShowSample={step.sample} />
            <div className="text-center">
              <button type="button" onClick={restart} className="font-display text-sm font-semibold text-primary underline-offset-4 hover:underline">
                Start over
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
