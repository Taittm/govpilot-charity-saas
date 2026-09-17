import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireWriteMembership, isAuthFailure } from "@/lib/api-auth";
import { createOrVersionDocument, DocumentUploadError } from "@/lib/documents";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orgId: string; meetingId: string }> }
) {
  const { orgId, meetingId } = await params;
  const authResult = await requireWriteMembership(orgId);
  if (isAuthFailure(authResult)) return authResult.error;
  const { session } = authResult;

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
