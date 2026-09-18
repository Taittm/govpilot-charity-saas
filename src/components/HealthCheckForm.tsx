"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SECTIONS, type Question } from "@/lib/health-check/questions";
import type { AnswerValue } from "@/lib/health-check/scoring";

const OPTIONS: { value: AnswerValue; label: string }[] = [
  { value: "YES", label: "Yes" },
  { value: "PARTIAL", label: "Partially" },
  { value: "NO", label: "No" },
];

function QuestionRow({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
}) {
  return (
    <div className="border-b border-gray-100 py-3 last:border-0">
      <p className="mb-2 text-sm">{question.text}</p>
      <div className="flex gap-4">
        {OPTIONS.map((opt) => (
          <label key={opt.value} className="flex items-center gap-1.5 text-sm text-gray-700">
            <input
              type="radio"
              name={question.id}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              required
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}

export function HealthCheckForm({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const totalQuestions = SECTIONS.reduce((sum, s) => sum + s.questions.length, 0);
  const answeredCount = Object.keys(answers).length;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (answeredCount < totalQuestions) {
      setError("Please answer every question before submitting.");
      return;
    }

    setLoading(true);
    const res = await fetch(`/api/organisations/${orgId}/health-checks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    setLoading(false);

    if (!res.ok) {
      setError("Could not save the health check. Please try again.");
      return;
    }

    const data = await res.json();
    router.push(`/dashboard/${orgId}/health-check/${data.id}`);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <p className="text-sm text-gray-500">
        {answeredCount} of {totalQuestions} answered
      </p>

      {SECTIONS.map((section) => (
        <fieldset key={section.key}>
          <legend className="mb-2 text-base font-semibold">{section.label}</legend>
          <div>
            {section.questions.map((q) => (
              <QuestionRow
                key={q.id}
                question={q}
                value={answers[q.id]}
                onChange={(value) => setAnswers((prev) => ({ ...prev, [q.id]: value }))}
              />
            ))}
          </div>
        </fieldset>
      ))}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="self-start rounded-md bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "Scoring..." : "Submit health check"}
      </button>
    </form>
  );
}
