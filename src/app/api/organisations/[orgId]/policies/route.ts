import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireWriteMembership, isAuthFailure } from "@/lib/api-auth";

const policySchema = z.object({
  name: z.string().min(1),
  reviewDueOn: z.string().min(1),
});

export async function POST(request: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params;
  const authResult = await requireWriteMembership(orgId);
  if (isAuthFailure(authResult)) return authResult.error;

  const parsed = policySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const policy = await prisma.policy.create({
    data: {
      organisationId: orgId,
      name: data.name,
      reviewDueOn: new Date(data.reviewDueOn),
    },
  });

  return NextResponse.json({ id: policy.id });
}
