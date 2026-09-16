import { SECTIONS, type SectionKey } from "./questions";

export type AnswerValue = "YES" | "PARTIAL" | "NO";
export type RagScore = "RED" | "AMBER" | "GREEN";

const POINTS: Record<AnswerValue, number> = { YES: 2, PARTIAL: 1, NO: 0 };

export function scoreFromAverage(average: number): RagScore {
  if (average >= 1.5) return "GREEN";
  if (average >= 0.75) return "AMBER";
  return "RED";
}

export function scoreSection(answers: Record<string, AnswerValue>, sectionKey: SectionKey): RagScore {
  const section = SECTIONS.find((s) => s.key === sectionKey);
  if (!section || section.questions.length === 0) return "RED";

  const total = section.questions.reduce((sum, q) => sum + POINTS[answers[q.id] ?? "NO"], 0);
  return scoreFromAverage(total / section.questions.length);
}

export function scoreOverall(sectionScores: Record<SectionKey, RagScore>): RagScore {
  const values = Object.values(sectionScores);
  const points: Record<RagScore, number> = { GREEN: 2, AMBER: 1, RED: 0 };
  const total = values.reduce((sum, s) => sum + points[s], 0);
  return scoreFromAverage(total / values.length);
}

export function computeScores(answers: Record<string, AnswerValue>) {
  const sectionScores = {} as Record<SectionKey, RagScore>;
  for (const section of SECTIONS) {
    sectionScores[section.key] = scoreSection(answers, section.key);
  }
  const overallScore = scoreOverall(sectionScores);
  return { sectionScores, overallScore };
}

export const RAG_LABEL: Record<RagScore, string> = {
  RED: "Red",
  AMBER: "Amber",
  GREEN: "Green",
};

export const RAG_COLOR: Record<RagScore, { bg: string; text: string; dot: string }> = {
  RED: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  AMBER: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  GREEN: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
};
