import type { Organisation } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getDeadlines, getGovernanceDeadlines, getGrantDeadlines, type Deadline } from "@/lib/deadlines";

export async function listTrustees(organisationId: string) {
  return prisma.trustee.findMany({ where: { organisationId }, orderBy: { name: "asc" } });
}

export async function listMeetings(organisationId: string) {
  return prisma.meeting.findMany({ where: { organisationId }, orderBy: { scheduledFor: "desc" } });
}

export async function listConflictsOfInterest(organisationId: string) {
  return prisma.conflictOfInterest.findMany({ where: { organisationId }, orderBy: { declaredOn: "desc" } });
}

export async function listPolicies(organisationId: string) {
  return prisma.policy.findMany({ where: { organisationId }, orderBy: { reviewDueOn: "asc" } });
}

export async function getAllDeadlinesForOrganisation(
  organisation: Organisation,
  reference: Date = new Date()
): Promise<Deadline[]> {
  const [trustees, policies, icoRegistration, grants] = await Promise.all([
    prisma.trustee.findMany({
      where: { organisationId: organisation.id, dbsExpiresOn: { not: null } },
    }),
    prisma.policy.findMany({ where: { organisationId: organisation.id } }),
    prisma.icoRegistration.findUnique({ where: { organisationId: organisation.id } }),
    prisma.grant.findMany({
      where: { organisationId: organisation.id },
      include: { reportingObligations: true },
    }),
  ]);

  const icoOverride = icoRegistration
    ? { tier: icoRegistration.tier, renewalOn: icoRegistration.renewalOn }
    : undefined;

  return [
    ...getDeadlines(organisation, reference, icoOverride),
    ...getGovernanceDeadlines(trustees, policies, reference),
    ...getGrantDeadlines(grants, reference),
  ].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}
