import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireMemberManagement, isAuthFailure } from "@/lib/api-auth";
import { isLastAdmin } from "@/lib/invitations";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orgId: string; membershipId: string }> }
) {
  const { orgId, membershipId } = await params;
  const authResult = await requireMemberManagement(orgId);
  if (isAuthFailure(authResult)) return authResult.error;

  const membership = await prisma.membership.findFirst({ where: { id: membershipId, organisationId: orgId } });
  if (!membership) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (await isLastAdmin(orgId, membershipId)) {
    return NextResponse.json(
      { error: "This is the only consultant/admin — promote someone else before removing them." },
      { status: 400 }
    );
  }

  await prisma.membership.delete({ where: { id: membershipId } });

  return NextResponse.json({ ok: true });
}
