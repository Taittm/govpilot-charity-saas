import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireWriteMembership, isAuthFailure } from "@/lib/api-auth";

const schema = z.object({
  name: z.string().min(1),
  funder: z.string().min(1),
  amount: z.union([z.coerce.number().min(0), z.literal("")]).optional(),
  applicationDeadline: z.string().min(1),
  status: z.enum(["RESEARCHING", "APPLIED", "AWARDED", "DECLINED", "COMPLETED"]),
  notes: z.string().optional(),
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

  const grant = await prisma.grant.create({
    data: {
      organisationId: orgId,
      name: data.name,
      funder: data.funder,
      amount: data.amount === "" || data.amount === undefined ? null : data.amount,
      applicationDeadline: new Date(data.applicationDeadline),
      status: data.status,
      notes: data.notes || null,
    },
  });

  return NextResponse.json({ id: grant.id });
}
