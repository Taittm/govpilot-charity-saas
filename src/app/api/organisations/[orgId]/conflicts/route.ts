import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireWriteMembership, isAuthFailure } from "@/lib/api-auth";

const conflictSchema = z.object({
  personName: z.string().min(1),
  interest: z.string().min(1),
  declaredOn: z.string().min(1),
});

export async function POST(request: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params;
  const authResult = await requireWriteMembership(orgId);
  if (isAuthFailure(authResult)) return authResult.error;

  const parsed = conflictSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const conflict = await prisma.conflictOfInterest.create({
    data: {
      organisationId: orgId,
      personName: data.personName,
      interest: data.interest,
      declaredOn: new Date(data.declaredOn),
    },
  });

  return NextResponse.json({ id: conflict.id });
}
