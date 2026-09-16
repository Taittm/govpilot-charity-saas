import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getMembership } from "@/lib/orgs";
import { calculateSarDueDate } from "@/lib/sar";

const schema = z.object({
  requesterName: z.string().optional(),
  receivedOn: z.string().min(1),
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
