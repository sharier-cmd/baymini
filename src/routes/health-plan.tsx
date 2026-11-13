import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { PlanForm } from "@/components/plan/PlanForm";
import { PlanResults } from "@/components/plan/PlanResults";
import { AiErrorCard } from "@/components/site/AiStatus";
import { Disclaimer } from "@/components/site/Disclaimer";
import { GeneratingScreen, type Stage } from "@/components/site/GeneratingScreen";
import { PageHeading } from "@/components/site/PageHeading";
import type { AiErrorCode } from "@/lib/ai-result";
import { generateHealthPlan } from "@/lib/health-plan.functions";
import type { HealthPlan, HealthProfile } from "@/lib/health-plan.schema";
import { emptyPlanForm, validatePlanForm, type PlanFormErrors, type PlanFormState } from "@/lib/plan-form";
import { SAMPLE_PLAN } from "@/lib/sample-data";

export const Route = createFileRoute("/health-plan")({
  head: () => ({
    meta: [
      { title: "Your Customized Health Plan — Baymini" },
      {
        name: "description",
        content:
          "Tell Baymini about yourself and get an AI-written daily routine with local meals, exercise and sleep guidance.",
      },
      { property: "og:title", content: "Your Customized Health Plan — Baymini" },
      { property: "og:description", content: "A personalized daily lifestyle plan built around your body, goals and local food." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HealthPlanPage,
});

type View =
  | { kind: "form" }
  | { kind: "loading" }
  | { kind: "error"; code: AiErrorCode; message: string }
  | { kind: "result"; plan: HealthPlan; profile: HealthProfile; isSample: boolean };

function HealthPlanPage() {
  const [form, setForm] = useState<PlanFormState>(emptyPlanForm);
  const [errors, setErrors] = useState<PlanFormErrors>({});
  const [view, setView] = useState<View>({ kind: "form" });
  const lastProfile = useRef<HealthProfile | null>(null);
  const generate = useServerFn(generateHealthPlan);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  async function run(profile: HealthProfile) {
    lastProfile.current = profile;
    setView({ kind: "loading" });
    scrollTop();
    try {
      const res = await generate({ data: profile });
      if (res.ok) {
        setView({ kind: "result", plan: res.data, profile, isSample: false });
      } else {
        setView({ kind: "error", code: res.code, message: res.message });
      }
    } catch {
      setView({
        kind: "error",
        code: "unavailable",
        message: "We couldn't reach Baymini. Check your connection and try again.",
      });
    }
    scrollTop();
  }

  function handleSubmit() {
    const r = validatePlanForm(form);
    if (!r.ok) {
      setErrors(r.errors);
      toast.error("Please complete the highlighted fields.");
      requestAnimationFrame(() => {
        document.querySelector("[data-field-error='true']")?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }
    setErrors({});
    void run(r.profile);
  }

  const stages: Stage[] =
    view.kind === "loading"
      ? [
          { label: "Checked your information", state: "done" },
          { label: "Sent securely to Baymini AI", state: "done" },
          { label: "Writing and safety-checking your plan", state: "active" },
        ]
      : [];

  return (
    <div className="mx-auto max-w-5xl px-6 pb-8 pt-12 sm:pt-16">
      {view.kind === "form" ? (
        <>
          <PageHeading eyebrow="Feature one" title="Your Customized Health Plan">
            Answer a few questions on one page. Baymini turns them into a simple routine for your
            whole day, with meals from your local cuisine.
          </PageHeading>
          <Disclaimer className="mt-6" />
          <div className="mt-10">
            <PlanForm value={form} errors={errors} onChange={setForm} onSubmit={handleSubmit} />
          </div>
        </>
      ) : null}

      {view.kind === "loading" ? (
        <div className="py-10">
          <GeneratingScreen title="Creating your health plan" stages={stages} />
        </div>
      ) : null}

      {view.kind === "error" ? (
        <div className="py-10">
          <AiErrorCard
            code={view.code}
            message={view.message}
            onRetry={() => lastProfile.current && void run(lastProfile.current)}
            onShowSample={() =>
              lastProfile.current &&
              setView({ kind: "result", plan: SAMPLE_PLAN, profile: lastProfile.current, isSample: true })
            }
          />
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setView({ kind: "form" })}
              className="font-display text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              Back to my information
            </button>
          </div>
        </div>
      ) : null}

      {view.kind === "result" ? (
        <PlanResults
          plan={view.plan}
          primaryGoal={view.profile.primaryGoal}
          isSample={view.isSample}
          onRegenerate={() => void run(view.profile)}
          onEdit={() => {
            setView({ kind: "form" });
            scrollTop();
          }}
        />
      ) : null}
    </div>
  );
}
