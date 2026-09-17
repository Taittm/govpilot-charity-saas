import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireWriteMembership, isAuthFailure } from "@/lib/api-auth";

export async function POST(request: Request, { params }: { params: Promise<{ orgId: string; id: string }> }) {
  const { orgId, id } = await params;
  const authResult = await requireWriteMembership(orgId);
  if (isAuthFailure(authResult)) return authResult.error;

  const sar = await prisma.subjectAccessRequest.findFirst({ where: { id, organisationId: orgId } });
  if (!sar) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.subjectAccessRequest.update({ where: { id }, data: { status: "COMPLETED" } });

  return NextResponse.json({ ok: true });
}
