import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireMemberManagement, isAuthFailure } from "@/lib/api-auth";
import { isLastAdmin } from "@/lib/invitations";

const schema = z.object({
  role: z.enum(["CONSULTANT_ADMIN", "TRUSTEE_DIRECTOR", "STAFF", "VOLUNTEER", "READ_ONLY"]),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orgId: string; membershipId: string }> }
) {
  const { orgId, membershipId } = await params;
  const authResult = await requireMemberManagement(orgId);
  if (isAuthFailure(authResult)) return authResult.error;

  const membership = await prisma.membership.findFirst({ where: { id: membershipId, organisationId: orgId } });
  if (!membership) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.role !== "CONSULTANT_ADMIN" && (await isLastAdmin(orgId, membershipId))) {
    return NextResponse.json(
      { error: "This is the only consultant/admin — promote someone else first." },
      { status: 400 }
    );
  }

  await prisma.membership.update({ where: { id: membershipId }, data: { role: parsed.data.role } });

  return NextResponse.json({ ok: true });
}
