import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireWriteMembership, isAuthFailure } from "@/lib/api-auth";
import { SECTIONS } from "@/lib/health-check/questions";
import { computeScores } from "@/lib/health-check/scoring";

const answerSchema = z.record(z.string(), z.enum(["YES", "PARTIAL", "NO"]));

export async function POST(request: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params;
  const authResult = await requireWriteMembership(orgId);
  if (isAuthFailure(authResult)) return authResult.error;
  const { session } = authResult;

  const body = await request.json();
  const parsed = answerSchema.safeParse(body.answers);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const allQuestionIds = SECTIONS.flatMap((s) => s.questions.map((q) => q.id));
  const answers = parsed.data;
  const missing = allQuestionIds.filter((id) => !answers[id]);
  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing answers for: ${missing.join(", ")}` }, { status: 400 });
  }

  const { sectionScores, overallScore } = computeScores(answers);

  const last = await prisma.healthCheck.findFirst({
    where: { organisationId: orgId },
    orderBy: { version: "desc" },
  });
  const nextVersion = (last?.version ?? 0) + 1;

  const healthCheck = await prisma.healthCheck.create({
    data: {
      organisationId: orgId,
      createdByUserId: session.user.id,
      version: nextVersion,
      overallScore,
      answers: {
        create: SECTIONS.flatMap((section) =>
          section.questions.map((q) => ({
            questionId: q.id,
            sectionKey: section.key,
            value: answers[q.id],
          }))
        ),
      },
      sectionScores: {
        create: Object.entries(sectionScores).map(([sectionKey, score]) => ({
          sectionKey,
          score,
        })),
      },
    },
  });

  return NextResponse.json({ id: healthCheck.id });
}
