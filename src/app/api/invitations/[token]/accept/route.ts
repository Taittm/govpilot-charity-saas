import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getInvitationByToken } from "@/lib/invitations";

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { token } = await params;
  const invitation = await getInvitationByToken(token);
  if (!invitation) return NextResponse.json({ error: "This invitation link is invalid." }, { status: 404 });

  if (invitation.acceptedAt) {
    return NextResponse.json({ error: "This invitation has already been used." }, { status: 400 });
  }
  if (invitation.expiresAt < new Date()) {
    return NextResponse.json({ error: "This invitation has expired." }, { status: 400 });
  }
  if (invitation.email.toLowerCase() !== session.user.email?.toLowerCase()) {
    return NextResponse.json(
      { error: `This invitation was sent to ${invitation.email} — log in with that email to accept it.` },
      { status: 403 }
    );
  }

  await prisma.$transaction([
    prisma.membership.upsert({
      where: { userId_organisationId: { userId: session.user.id, organisationId: invitation.organisationId } },
      update: { role: invitation.role },
      create: { userId: session.user.id, organisationId: invitation.organisationId, role: invitation.role },
    }),
    prisma.invitation.update({ where: { id: invitation.id }, data: { acceptedAt: new Date() } }),
  ]);

  return NextResponse.json({ organisationId: invitation.organisationId });
}
