import { createFileRoute } from "@tanstack/react-router";

import { PageHeading } from "@/components/site/PageHeading";

export const Route = createFileRoute("/medical-disclaimer")({
  head: () => ({
    meta: [
      { title: "Medical Disclaimer — Baymini" },
      { name: "description", content: "Baymini provides general health information, not medical advice." },
      { property: "og:title", content: "Medical Disclaimer — Baymini" },
      { property: "og:description", content: "Baymini provides general health information, not medical advice." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-8 pt-12 sm:pt-16">
      <PageHeading title="Medical Disclaimer" />
      <div className="soft-card mt-8 space-y-4 p-7 font-body leading-relaxed text-foreground sm:p-9">
        <p>Baymini provides AI-generated health information for educational purposes only. It is not a substitute for professional medical diagnosis, treatment or advice.</p>
        <p>Always consult a qualified healthcare professional about medical concerns. If you think you may have a medical emergency, call your local emergency number immediately.</p>
      </div>
    </div>
  );
}
