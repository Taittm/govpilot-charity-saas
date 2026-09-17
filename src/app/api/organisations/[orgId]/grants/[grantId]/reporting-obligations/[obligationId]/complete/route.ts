import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireWriteMembership, isAuthFailure } from "@/lib/api-auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orgId: string; grantId: string; obligationId: string }> }
) {
  const { orgId, grantId, obligationId } = await params;
  const authResult = await requireWriteMembership(orgId);
  if (isAuthFailure(authResult)) return authResult.error;

  const obligation = await prisma.grantReportingObligation.findFirst({
    where: { id: obligationId, grantId, grant: { organisationId: orgId } },
  });
  if (!obligation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.grantReportingObligation.update({ where: { id: obligationId }, data: { completed: true } });

  return NextResponse.json({ ok: true });
}
