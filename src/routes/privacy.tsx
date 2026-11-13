import { createFileRoute } from "@tanstack/react-router";

import { PageHeading } from "@/components/site/PageHeading";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Baymini" },
      { name: "description", content: "How Baymini handles the health information you share." },
      { property: "og:title", content: "Privacy Policy — Baymini" },
      { property: "og:description", content: "How Baymini handles the health information you share." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-8 pt-12 sm:pt-16">
      <PageHeading title="Privacy Policy" />
      <div className="soft-card mt-8 space-y-4 p-7 font-body leading-relaxed text-foreground sm:p-9">
        <p>Baymini does not require an account. Information you enter is sent securely to our AI service only to create your plan or symptom guidance.</p>
        <p>We do not save your answers in a database, put them in page addresses, or record your health details in our logs. Closing or refreshing the page clears them.</p>
      </div>
    </div>
  );
}
