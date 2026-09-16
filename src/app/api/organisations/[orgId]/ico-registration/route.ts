import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getMembership } from "@/lib/orgs";

const schema = z.object({
  tier: z.enum(["TIER_1", "TIER_2", "TIER_3"]),
  renewalOn: z.string().optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) return NextResponse.json({ error: "Not found" }, { status: 404 });

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
