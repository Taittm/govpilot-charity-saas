import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const orgSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["CHARITY", "CIC", "BOTH"]),
  incomeBand: z.enum(["UNDER_10K", "BETWEEN_10K_25K", "OVER_25K", "OVER_250K", "OVER_1M"]),
  financialYearEnd: z.string().min(1),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = orgSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { name, type, incomeBand, financialYearEnd } = parsed.data;

  const organisation = await prisma.organisation.create({
    data: {
      name,
      type,
      incomeBand,
      financialYearEnd: new Date(financialYearEnd),
      memberships: {
        create: {
          userId: session.user.id,
          role: "CONSULTANT_ADMIN",
        },
      },
    },
  });

  return NextResponse.json({ id: organisation.id });
}
