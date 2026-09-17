import { NextResponse } from "next/server";
import { z } from "zod";
import { requireMemberManagement, isAuthFailure } from "@/lib/api-auth";
import { createInvitation } from "@/lib/invitations";

const schema = z.object({
  email: z.string().email(),
  role: z.enum(["CONSULTANT_ADMIN", "TRUSTEE_DIRECTOR", "STAFF", "VOLUNTEER", "READ_ONLY"]),
});

export async function POST(request: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params;
  const authResult = await requireMemberManagement(orgId);
  if (isAuthFailure(authResult)) return authResult.error;
  const { session } = authResult;

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { email, role } = parsed.data;

  const invitation = await createInvitation({
    organisationId: orgId,
    invitedByUserId: session.user.id,
    email,
    role,
  });

  const origin = new URL(request.url).origin;
  return NextResponse.json({ id: invitation.id, url: `${origin}/invite/${invitation.token}` });
}
