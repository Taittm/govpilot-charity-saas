import { prisma } from "@/lib/prisma";

export async function listGrants(organisationId: string) {
  return prisma.grant.findMany({
    where: { organisationId },
    orderBy: { applicationDeadline: "asc" },
    include: { reportingObligations: { orderBy: { dueOn: "asc" } } },
  });
}
