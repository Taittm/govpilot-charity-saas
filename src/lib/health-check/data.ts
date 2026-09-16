import { prisma } from "@/lib/prisma";
import { getMembership } from "@/lib/orgs";
import type { SectionKey } from "./questions";
import type { RagScore } from "./scoring";

export async function getHealthCheckForUser(userId: string, healthCheckId: string) {
  const healthCheck = await prisma.healthCheck.findUnique({
    where: { id: healthCheckId },
    include: {
      organisation: true,
      answers: true,
      sectionScores: true,
      createdBy: true,
    },
  });
  if (!healthCheck) return null;

  const membership = await getMembership(userId, healthCheck.organisationId);
  if (!membership) return null;

  const previous = await prisma.healthCheck.findFirst({
    where: { organisationId: healthCheck.organisationId, version: { lt: healthCheck.version } },
    orderBy: { version: "desc" },
    include: { sectionScores: true },
  });

  const sectionScoreMap = Object.fromEntries(
    healthCheck.sectionScores.map((s) => [s.sectionKey, s.score])
  ) as Record<SectionKey, RagScore>;

  const previousSectionScoreMap = previous
    ? (Object.fromEntries(previous.sectionScores.map((s) => [s.sectionKey, s.score])) as Record<
        SectionKey,
        RagScore
      >)
    : null;

  return {
    healthCheck,
    membership,
    sectionScoreMap,
    previous,
    previousSectionScoreMap,
  };
}

export async function listHealthChecksForOrg(orgId: string) {
  return prisma.healthCheck.findMany({
    where: { organisationId: orgId },
    orderBy: { version: "desc" },
    include: { createdBy: true },
  });
}
