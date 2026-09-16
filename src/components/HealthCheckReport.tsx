import { SECTIONS } from "@/lib/health-check/questions";
import { RAG_LABEL, RAG_COLOR, type RagScore } from "@/lib/health-check/scoring";
import type { SectionKey } from "@/lib/health-check/questions";

const RAG_RANK: Record<RagScore, number> = { RED: 0, AMBER: 1, GREEN: 2 };

function Delta({ current, previous }: { current: RagScore; previous: RagScore | null | undefined }) {
  if (!previous) return <span className="text-xs text-gray-400">first run</span>;
  const diff = RAG_RANK[current] - RAG_RANK[previous];
  if (diff > 0)
    return (
      <span className="text-xs font-medium text-green-700">
        ▲ improved from {RAG_LABEL[previous]}
      </span>
    );
  if (diff < 0)
    return (
      <span className="text-xs font-medium text-red-700">▼ down from {RAG_LABEL[previous]}</span>
    );
  return <span className="text-xs text-gray-400">unchanged</span>;
}

export function HealthCheckReport({
  organisationName,
  version,
  createdAt,
  createdByLabel,
  overallScore,
  previousOverallScore,
  sectionScoreMap,
  previousSectionScoreMap,
}: {
  organisationName: string;
  version: number;
  createdAt: Date;
  createdByLabel: string;
  overallScore: RagScore;
  previousOverallScore: RagScore | null;
  sectionScoreMap: Record<SectionKey, RagScore>;
  previousSectionScoreMap: Record<SectionKey, RagScore> | null;
}) {
  const overallColor = RAG_COLOR[overallScore];

  return (
    <div>
      <header className="mb-6 flex items-start justify-between border-b border-gray-200 pb-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">Compliance Health Check</p>
          <h1 className="text-xl font-semibold">{organisationName}</h1>
          <p className="text-sm text-gray-500">
            Version {version} ·{" "}
            {createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} · run by{" "}
            {createdByLabel}
          </p>
        </div>
        <div className={`rounded-lg px-4 py-3 text-center ${overallColor.bg}`}>
          <p className={`text-lg font-semibold ${overallColor.text}`}>{RAG_LABEL[overallScore]}</p>
          <p className="text-xs text-gray-500">Overall score</p>
          <Delta current={overallScore} previous={previousOverallScore} />
        </div>
      </header>

      <div className="flex flex-col gap-3">
        {SECTIONS.map((section) => {
          const score = sectionScoreMap[section.key];
          const color = RAG_COLOR[score];
          const previousScore = previousSectionScoreMap?.[section.key];
          return (
            <div
              key={section.key}
              className="flex items-center justify-between rounded-md border border-gray-200 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${color.dot}`} />
                <span className="text-sm font-medium">{section.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <Delta current={score} previous={previousScore} />
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${color.bg} ${color.text}`}>
                  {RAG_LABEL[score]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
