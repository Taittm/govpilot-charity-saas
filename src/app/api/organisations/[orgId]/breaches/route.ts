import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getMembership } from "@/lib/orgs";

const schema = z.object({
  occurredOn: z.string().min(1),
  description: z.string().min(1),
  actionTaken: z.string().min(1),
  reportedToIco: z.boolean(),
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

  const breach = await prisma.dataBreach.create({
    data: {
      organisationId: orgId,
      occurredOn: new Date(data.occurredOn),
      description: data.description,
      actionTaken: data.actionTaken,
      reportedToIco: data.reportedToIco,
    },
  });

  return NextResponse.json({ id: breach.id });
}
