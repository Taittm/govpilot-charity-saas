import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "consultant@example.com";
  const password = "password123";
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      name: "Demo Consultant",
      accountType: "CONSULTANT",
    },
  });

  await prisma.organisation.upsert({
    where: { id: "demo-org-1" },
    update: {},
    create: {
      id: "demo-org-1",
      name: "Riverside Community Trust",
      type: "CHARITY",
      incomeBand: "BETWEEN_10K_25K",
      financialYearEnd: new Date("2027-03-31"),
      memberships: { create: { userId: user.id, role: "CONSULTANT_ADMIN" } },
    },
  });

  await prisma.organisation.upsert({
    where: { id: "demo-org-2" },
    update: {},
    create: {
      id: "demo-org-2",
      name: "Northgate Youth CIC",
      type: "CIC",
      incomeBand: "OVER_25K",
      financialYearEnd: new Date("2026-12-31"),
      memberships: { create: { userId: user.id, role: "CONSULTANT_ADMIN" } },
    },
  });

  console.log(`Seeded demo consultant: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
