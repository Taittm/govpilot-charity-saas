import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getMembership } from "@/lib/orgs";

const conflictSchema = z.object({
  personName: z.string().min(1),
  interest: z.string().min(1),
  declaredOn: z.string().min(1),
});

export async function POST(request: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) return NextResponse.json({ error: "Not found" }, { status: 404 });

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
