import { prisma } from "@/lib/prisma";

const INVITATION_TTL_DAYS = 7;

export async function listMembers(organisationId: string) {
  return prisma.membership.findMany({
    where: { organisationId },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function listPendingInvitations(organisationId: string) {
  return prisma.invitation.findMany({
    where: { organisationId, acceptedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
}

export async function createInvitation({
  organisationId,
  invitedByUserId,
  email,
  role,
}: {
  organisationId: string;
  invitedByUserId: string;
  email: string;
  role: "CONSULTANT_ADMIN" | "TRUSTEE_DIRECTOR" | "STAFF" | "VOLUNTEER" | "READ_ONLY";
}) {
  const expiresAt = new Date(Date.now() + INVITATION_TTL_DAYS * 24 * 60 * 60 * 1000);
  return prisma.invitation.create({
    data: { organisationId, invitedByUserId, email: email.toLowerCase(), role, expiresAt },
  });
}

export async function getInvitationByToken(token: string) {
  return prisma.invitation.findUnique({
    where: { token },
    include: { organisation: true, invitedBy: true },
  });
}

// The last CONSULTANT_ADMIN can't remove themselves or be demoted away —
// otherwise an organisation could end up with no one able to manage access.
export async function isLastAdmin(organisationId: string, membershipId: string): Promise<boolean> {
  const admins = await prisma.membership.count({ where: { organisationId, role: "CONSULTANT_ADMIN" } });
  if (admins > 1) return false;
  const membership = await prisma.membership.findUnique({ where: { id: membershipId } });
  return membership?.role === "CONSULTANT_ADMIN";
}
