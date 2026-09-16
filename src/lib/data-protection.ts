import { prisma } from "@/lib/prisma";

export async function getIcoRegistration(organisationId: string) {
  return prisma.icoRegistration.findUnique({ where: { organisationId } });
}

export async function listDataBreaches(organisationId: string) {
  return prisma.dataBreach.findMany({ where: { organisationId }, orderBy: { occurredOn: "desc" } });
}

export async function listSubjectAccessRequests(organisationId: string) {
  return prisma.subjectAccessRequest.findMany({ where: { organisationId }, orderBy: { receivedOn: "desc" } });
}
