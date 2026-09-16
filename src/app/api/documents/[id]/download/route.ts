import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDocumentForUser } from "@/lib/documents";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const document = await getDocumentForUser(session.user.id, id);
  if (!document) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return new NextResponse(new Uint8Array(document.content), {
    headers: {
      "Content-Type": document.mimeType,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(document.filename)}"`,
      "Content-Length": String(document.sizeBytes),
    },
  });
}
