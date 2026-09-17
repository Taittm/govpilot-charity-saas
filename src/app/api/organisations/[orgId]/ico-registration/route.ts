import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireWriteMembership, isAuthFailure } from "@/lib/api-auth";

const schema = z.object({
  tier: z.enum(["TIER_1", "TIER_2", "TIER_3"]),
  renewalOn: z.string().optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params;
  const authResult = await requireWriteMembership(orgId);
  if (isAuthFailure(authResult)) return authResult.error;

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  const renewalOn = data.renewalOn ? new Date(data.renewalOn) : null;

  const record = await prisma.icoRegistration.upsert({
    where: { organisationId: orgId },
    update: { tier: data.tier, renewalOn },
    create: { organisationId: orgId, tier: data.tier, renewalOn },
  });

  return NextResponse.json({ id: record.id });
}
