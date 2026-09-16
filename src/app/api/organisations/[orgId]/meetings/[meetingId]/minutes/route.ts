import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getMembership } from "@/lib/orgs";
import { createOrVersionDocument, DocumentUploadError } from "@/lib/documents";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orgId: string; meetingId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { orgId, meetingId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const meeting = await prisma.meeting.findFirst({ where: { id: meetingId, organisationId: orgId } });
  if (!meeting) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "A file is required." }, { status: 400 });
  }

  try {
    const document = await createOrVersionDocument({
      organisationId: orgId,
      uploadedByUserId: session.user.id,
      tag: "MINUTES",
      file,
      groupId: meeting.minutesGroupId,
    });

    if (!meeting.minutesGroupId) {
      await prisma.meeting.update({ where: { id: meetingId }, data: { minutesGroupId: document.groupId } });
    }

    return NextResponse.json({ id: document.id, groupId: document.groupId });
  } catch (err) {
    if (err instanceof DocumentUploadError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }
}
