import { ArrowLeft, ArrowRight } from "lucide-react";

import { OptionTile } from "@/components/form/OptionTile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FollowUpQuestion } from "@/lib/symptoms.schema";

export type Answers = Record<string, string | string[]>;

export function FollowUpForm({
  questions,
  answers,
  onChange,
  onBack,
  onSubmit,
}: {
  questions: FollowUpQuestion[];
  answers: Answers;
  onChange: (a: Answers) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-5">
      {questions.map((q, i) => {
        const a = answers[q.id];
        return (
          <fieldset key={q.id} className="soft-card p-6 sm:p-7">
            <legend className="sr-only">{q.question}</legend>
            <p className="eyebrow">Question {i + 1} of {questions.length}</p>
            <h3 aria-hidden="true" className="mt-2 text-lg font-semibold">{q.question}</h3>
            {q.type === "short_text" ? (
              <Input
                className="mt-4"
                aria-label={q.question}
                maxLength={600}
                placeholder="Type a short answer"
                value={typeof a === "string" ? a : ""}
                onChange={(e) => onChange({ ...answers, [q.id]: e.target.value })}
              />
            ) : (
              <div
                role={q.type === "single_choice" ? "radiogroup" : "group"}
                aria-label={q.question}
                className="mt-4 grid gap-2 sm:grid-cols-2"
              >
                {q.options.map((o) => {
                  const selected = q.type === "single_choice" ? a === o : Array.isArray(a) && a.includes(o);
                  return (
                    <OptionTile
                      key={o}
                      kind={q.type === "single_choice" ? "radio" : "checkbox"}
                      selected={selected}
                      onToggle={() => {
                        if (q.type === "single_choice") {
                          onChange({ ...answers, [q.id]: o });
                        } else {
                          const list = Array.isArray(a) ? a : [];
                          onChange({ ...answers, [q.id]: list.includes(o) ? list.filter((x) => x !== o) : [...list, o] });
                        }
                      }}
                    >
                      {o}
                    </OptionTile>
                  );
                })}
              </div>
            )}
          </fieldset>
        );
      })}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft strokeWidth={1.8} /> Back
        </Button>
        <Button size="lg" onClick={onSubmit}>
          See my guidance <ArrowRight strokeWidth={1.8} />
        </Button>
      </div>
    </div>
  );
}
