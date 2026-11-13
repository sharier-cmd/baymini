import { createFileRoute } from "@tanstack/react-router";

import { PageHeading } from "@/components/site/PageHeading";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Baymini — Baymini" },
      { name: "description", content: "Baymini is an AI-powered personal health and wellness platform." },
      { property: "og:title", content: "About Baymini — Baymini" },
      { property: "og:description", content: "Baymini is an AI-powered personal health and wellness platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-8 pt-12 sm:pt-16">
      <PageHeading title="About Baymini" />
      <div className="soft-card mt-8 space-y-4 p-7 font-body leading-relaxed text-foreground sm:p-9">
        <p>Baymini helps people understand their health, receive personalized lifestyle recommendations and get preliminary guidance about their symptoms.</p>
        <p>It was built as a hackathon project. Baymini offers general wellness information and is not a medical service.</p>
      </div>
    </div>
  );
}
