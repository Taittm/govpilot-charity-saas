import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getMembership } from "@/lib/orgs";

export async function POST(request: Request, { params }: { params: Promise<{ orgId: string; id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { orgId, id } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const sar = await prisma.subjectAccessRequest.findFirst({ where: { id, organisationId: orgId } });
  if (!sar) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.subjectAccessRequest.update({ where: { id }, data: { status: "COMPLETED" } });

  return NextResponse.json({ ok: true });
}
