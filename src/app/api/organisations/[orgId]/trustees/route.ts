import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getMembership } from "@/lib/orgs";

const trusteeSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  appointedOn: z.string().min(1),
  termEndsOn: z.string().optional(),
  dbsCheckType: z.enum(["NONE", "BASIC", "STANDARD", "ENHANCED"]),
  dbsCheckedOn: z.string().optional(),
  dbsExpiresOn: z.string().optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = trusteeSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const trustee = await prisma.trustee.create({
    data: {
      organisationId: orgId,
      name: data.name,
      role: data.role,
      appointedOn: new Date(data.appointedOn),
      termEndsOn: data.termEndsOn ? new Date(data.termEndsOn) : null,
      dbsCheckType: data.dbsCheckType,
      dbsCheckedOn: data.dbsCheckedOn ? new Date(data.dbsCheckedOn) : null,
      dbsExpiresOn: data.dbsExpiresOn ? new Date(data.dbsExpiresOn) : null,
    },
  });

  return NextResponse.json({ id: trustee.id });
}
