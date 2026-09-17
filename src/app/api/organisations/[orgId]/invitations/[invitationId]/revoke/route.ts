import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireMemberManagement, isAuthFailure } from "@/lib/api-auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orgId: string; invitationId: string }> }
) {
  const { orgId, invitationId } = await params;
  const authResult = await requireMemberManagement(orgId);
  if (isAuthFailure(authResult)) return authResult.error;

  const invitation = await prisma.invitation.findFirst({ where: { id: invitationId, organisationId: orgId } });
  if (!invitation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.invitation.delete({ where: { id: invitationId } });

  return NextResponse.json({ ok: true });
}
