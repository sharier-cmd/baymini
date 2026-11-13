import { createFileRoute } from "@tanstack/react-router";
import { Mail, Stethoscope } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/take-docs-advice")({
  head: () => ({
    meta: [
      { title: "Take Doc's Advice — Coming Soon | Baymini" },
      { name: "description", content: "Baymini is working towards connecting you with qualified healthcare professionals near you." },
      { property: "og:title", content: "Take Doc's Advice — Coming Soon | Baymini" },
      { property: "og:description", content: "Your health deserves expert care. Coming soon to Baymini." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DocsAdvicePage,
});

function DocsAdvicePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-8 pt-16 text-center sm:pt-24">
      <span className="icon-chip mx-auto h-20 w-20">
        <Stethoscope className="h-9 w-9" strokeWidth={1.3} />
      </span>
      <p className="eyebrow mt-8">Take Doc's Advice</p>
      <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Your health deserves expert care.</h1>
      <p className="mx-auto mt-5 max-w-2xl font-body text-lg leading-relaxed text-muted-foreground">
        We're working towards connecting you with qualified healthcare professionals near you.
        Baymini is growing, and we would love doctors to be part of this journey.
      </p>
      <p className="mt-8 inline-flex rounded-full bg-primary px-6 py-2 font-display text-sm font-bold tracking-[0.3em] text-primary-foreground">
        COMING SOON
      </p>
      <div className="soft-card mx-auto mt-12 max-w-xl p-8">
        <p className="font-body text-foreground">
          Are you a doctor or healthcare professional interested in contributing to Baymini? We'd
          love to hear from you.
        </p>
        <Button asChild size="lg" className="mt-6">
          <a href="mailto:hello@baymini.app?subject=Contributing%20to%20Baymini">
            <Mail strokeWidth={1.6} /> Get in touch
          </a>
        </Button>
      </div>
    </div>
  );
}
