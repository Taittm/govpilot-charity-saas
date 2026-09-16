import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getMembership } from "@/lib/orgs";

const schema = z.object({
  yearEndOn: z.string().min(1),
  income: z.coerce.number().min(0),
  assets: z.union([z.coerce.number().min(0), z.literal("")]).optional(),
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
