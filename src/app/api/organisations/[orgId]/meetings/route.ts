import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getMembership } from "@/lib/orgs";

const meetingSchema = z.object({
  type: z.enum(["BOARD_MEETING", "AGM"]),
  title: z.string().min(1),
  scheduledFor: z.string().min(1),
});

export async function POST(request: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = meetingSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const meeting = await prisma.meeting.create({
    data: {
      organisationId: orgId,
      type: data.type,
      title: data.title,
      scheduledFor: new Date(data.scheduledFor),
    },
  });

  return NextResponse.json({ id: meeting.id });
}
