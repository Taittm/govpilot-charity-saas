import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireWriteMembership, isAuthFailure } from "@/lib/api-auth";

const schema = z.object({
  description: z.string().min(1),
  dueOn: z.string().min(1),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orgId: string; grantId: string }> }
) {
  const { orgId, grantId } = await params;
  const authResult = await requireWriteMembership(orgId);
  if (isAuthFailure(authResult)) return authResult.error;

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
