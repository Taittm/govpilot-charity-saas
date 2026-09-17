import { NextResponse } from "next/server";
import { DocumentTag } from "@prisma/client";
import { requireWriteMembership, isAuthFailure } from "@/lib/api-auth";
import { createOrVersionDocument, DocumentUploadError } from "@/lib/documents";

const VALID_TAGS = new Set<string>(Object.values(DocumentTag));

export async function POST(request: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params;
  const authResult = await requireWriteMembership(orgId);
  if (isAuthFailure(authResult)) return authResult.error;
  const { session } = authResult;

  const formData = await request.formData();
  const file = formData.get("file");
  const tag = formData.get("tag");
  const groupId = formData.get("groupId");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "A file is required." }, { status: 400 });
  }
  if (typeof tag !== "string" || !VALID_TAGS.has(tag)) {
    return NextResponse.json({ error: "Invalid tag." }, { status: 400 });
  }

  try {
    const document = await createOrVersionDocument({
      organisationId: orgId,
      uploadedByUserId: session.user.id,
      tag: tag as DocumentTag,
      file,
      groupId: typeof groupId === "string" && groupId.length > 0 ? groupId : null,
    });
    return NextResponse.json({ id: document.id, groupId: document.groupId });
  } catch (err) {
    if (err instanceof DocumentUploadError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }
}
