import { prisma } from "@/lib/prisma";

export async function getMembershipsForUser(userId: string) {
  return prisma.membership.findMany({
    where: { userId },
    include: { organisation: true },
    orderBy: { organisation: { name: "asc" } },
  });
}

export async function getMembership(userId: string, organisationId: string) {
  return prisma.membership.findUnique({
    where: { userId_organisationId: { userId, organisationId } },
    include: { organisation: true },
  });
}
