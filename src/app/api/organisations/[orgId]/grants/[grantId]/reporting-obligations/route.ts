import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getMembership } from "@/lib/orgs";

const schema = z.object({
  description: z.string().min(1),
  dueOn: z.string().min(1),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orgId: string; grantId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { orgId, grantId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const grant = await prisma.grant.findFirst({ where: { id: grantId, organisationId: orgId } });
  if (!grant) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const obligation = await prisma.grantReportingObligation.create({
    data: {
      grantId,
      description: data.description,
      dueOn: new Date(data.dueOn),
    },
  });

  return NextResponse.json({ id: obligation.id });
}
