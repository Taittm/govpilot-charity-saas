import { prisma } from "@/lib/prisma";

export async function listFinancialYearRecords(organisationId: string) {
  return prisma.financialYearRecord.findMany({
    where: { organisationId },
    orderBy: { yearEndOn: "desc" },
  });
}

export async function listDonations(organisationId: string) {
  return prisma.donation.findMany({
    where: { organisationId },
    orderBy: { donatedOn: "desc" },
  });
}
