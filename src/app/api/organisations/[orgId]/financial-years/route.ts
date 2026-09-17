import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireWriteMembership, isAuthFailure } from "@/lib/api-auth";

const schema = z.object({
  yearEndOn: z.string().min(1),
  income: z.coerce.number().min(0),
  assets: z.union([z.coerce.number().min(0), z.literal("")]).optional(),
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

  const record = await prisma.financialYearRecord.upsert({
    where: { organisationId_yearEndOn: { organisationId: orgId, yearEndOn: new Date(data.yearEndOn) } },
    update: {
      income: data.income,
      assets: data.assets === "" || data.assets === undefined ? null : data.assets,
    },
    create: {
      organisationId: orgId,
      yearEndOn: new Date(data.yearEndOn),
      income: data.income,
      assets: data.assets === "" || data.assets === undefined ? null : data.assets,
    },
  });

  return NextResponse.json({ id: record.id });
}
