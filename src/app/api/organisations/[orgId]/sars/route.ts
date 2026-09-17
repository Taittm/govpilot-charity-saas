import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireWriteMembership, isAuthFailure } from "@/lib/api-auth";
import { calculateSarDueDate } from "@/lib/sar";

const schema = z.object({
  requesterName: z.string().optional(),
  receivedOn: z.string().min(1),
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
  const receivedOn = new Date(data.receivedOn);

  const sar = await prisma.subjectAccessRequest.create({
    data: {
      organisationId: orgId,
      requesterName: data.requesterName || null,
      receivedOn,
      dueOn: calculateSarDueDate(receivedOn),
    },
  });

  return NextResponse.json({ id: sar.id, dueOn: sar.dueOn });
}
