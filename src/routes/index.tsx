import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ClipboardList,
  HeartPulse,
  Moon,
  Salad,
  Sparkles,
  Stethoscope,
  Sun,
  Sunset,
  UserRound,
  Footprints,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Baymini — Your health. Your journey. Your Baymini." },
      {
        name: "description",
        content:
          "Discover personalized wellness plans, understand your symptoms and make smarter decisions about your everyday health with Baymini.",
      },
      { property: "og:title", content: "Baymini — Your health. Your journey. Your Baymini." },
      {
        property: "og:description",
        content: "Personalized AI wellness plans and preliminary symptom guidance, built around you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const features = [
  {
    to: "/health-plan",
    icon: ClipboardList,
    title: "Your Customized Health Plan",
    body: "Personalized lifestyle recommendations based on your individual health information.",
    cta: "Build my plan",
  },
  {
    to: "/symptoms-checker",
    icon: HeartPulse,
    title: "Symptoms Checker",
    body: "AI-assisted preliminary symptom guidance through a simple questionnaire.",
    cta: "Check symptoms",
  },
  {
    to: "/take-docs-advice",
    icon: Stethoscope,
    title: "Take Doc's Advice",
    body: "Coming soon: connecting you with real healthcare professionals.",
    cta: "Learn more",
    soon: true,
  },
] as const;

const steps = [
  { icon: UserRound, title: "Share your health information", body: "A short, private form about you, your goals and how you eat." },
  { icon: Sparkles, title: "Receive personalized AI-powered guidance", body: "Baymini writes recommendations that fit your body and your day." },
  { icon: Footprints, title: "Take informed steps toward better everyday health", body: "Follow simple routines at your own pace, on your own terms." },
];

function Index() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 pb-20 pt-16 md:pt-24 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="animate-fade-up">
          <p className="eyebrow">AI-powered personal wellness</p>
          <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] text-foreground sm:text-6xl">
            Your health. Your journey.{" "}
            <span className="text-primary">Your Baymini.</span>
          </h1>
          <p className="mt-6 max-w-xl font-body text-lg leading-relaxed text-muted-foreground">
            A healthier life starts with understanding yourself. Discover personalized wellness
            plans, understand your symptoms and make smarter decisions about your everyday health.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild size="xl">
              <Link to="/health-plan">
                Start your health journey <ArrowRight strokeWidth={1.8} />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link to="/symptoms-checker">Check a symptom</Link>
            </Button>
          </div>
        </div>

        <PlanPreview />
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-12" aria-labelledby="features-title">
        <div className="max-w-2xl">
          <p className="eyebrow">What Baymini does</p>
          <h2 id="features-title" className="mt-3 text-3xl font-bold sm:text-4xl">
            Three simple ways to care for yourself
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map((f) => (
            <article key={f.to} className="soft-card soft-card-hover flex flex-col p-7">
              <div className="flex items-center justify-between">
                <span className="icon-chip h-12 w-12">
                  <f.icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                {"soon" in f ? (
                  <span className="rounded-full bg-muted px-3 py-1 font-display text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
                    Coming soon
                  </span>
                ) : null}
              </div>
              <h3 className="mt-6 text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 flex-1 font-body leading-relaxed text-muted-foreground">{f.body}</p>
              <Button asChild variant="soft" className="mt-7 self-start">
                <Link to={f.to}>
                  {f.cta} <ArrowRight strokeWidth={1.8} />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-16" aria-labelledby="how-title">
        <div className="rounded-[2rem] border border-border bg-card px-7 py-12 sm:px-12">
          <p className="eyebrow">How Baymini works</p>
          <h2 id="how-title" className="mt-3 text-3xl font-bold sm:text-4xl">
            From a few answers to a clearer day
          </h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <s.icon className="h-5 w-5 text-leaf" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 font-body text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

function PlanPreview() {
  const rows = [
    { icon: Sun, label: "Morning", text: "Water, light stretching, 20 min brisk walk" },
    { icon: Salad, label: "Lunch", text: "Rice, dal, fish and seasonal greens" },
    { icon: Sunset, label: "Evening", text: "Gentle mobility and a screen-free hour" },
    { icon: Moon, label: "Sleep", text: "Lights down by 10:30, aim for 7.5 hours" },
  ];
  return (
    <div className="relative mx-auto w-full max-w-md animate-fade-up [animation-delay:120ms]" aria-hidden="true">
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-sage-soft" />
      <div className="soft-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-body text-xs text-muted-foreground">Example plan preview</p>
            <p className="mt-0.5 font-display text-lg font-semibold">Your day, simplified</p>
          </div>
          <span className="icon-chip h-10 w-10">
            <Sparkles className="h-4 w-4" strokeWidth={1.6} />
          </span>
        </div>
        <ul className="mt-5 space-y-3">
          {rows.map((r) => (
            <li key={r.label} className="flex items-start gap-3 rounded-2xl bg-muted px-4 py-3">
              <r.icon className="mt-0.5 h-4 w-4 shrink-0 text-leaf" strokeWidth={1.6} />
              <div>
                <p className="font-display text-sm font-semibold">{r.label}</p>
                <p className="font-body text-sm text-muted-foreground">{r.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
