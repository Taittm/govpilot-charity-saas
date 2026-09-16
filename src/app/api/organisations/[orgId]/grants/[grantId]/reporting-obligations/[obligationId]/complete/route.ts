import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getMembership } from "@/lib/orgs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orgId: string; grantId: string; obligationId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { orgId, grantId, obligationId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const obligation = await prisma.grantReportingObligation.findFirst({
    where: { id: obligationId, grantId, grant: { organisationId: orgId } },
  });
  if (!obligation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.grantReportingObligation.update({ where: { id: obligationId }, data: { completed: true } });

  return NextResponse.json({ ok: true });
}
