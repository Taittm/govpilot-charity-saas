import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireWriteMembership, isAuthFailure } from "@/lib/api-auth";
import { GASDS_PER_DONATION_MAX } from "@/lib/gift-aid";

const schema = z.object({
  donorName: z.string().optional(),
  amount: z.coerce.number().positive(),
  scheme: z.enum(["GIFT_AID", "GASDS"]),
  method: z.enum(["CASH", "CONTACTLESS", "OTHER"]),
  donatedOn: z.string().min(1),
});

export async function POST(request: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params;
  const authResult = await requireWriteMembership(orgId);
  if (isAuthFailure(authResult)) return authResult.error;

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  if (data.scheme === "GASDS") {
    if (data.method === "OTHER") {
      return NextResponse.json(
        { error: "GASDS only applies to cash or contactless donations." },
        { status: 400 }
      );
    }
    if (data.amount > GASDS_PER_DONATION_MAX) {
      return NextResponse.json(
        { error: `GASDS only applies to donations of £${GASDS_PER_DONATION_MAX} or less.` },
        { status: 400 }
      );
    }
  }

  const donation = await prisma.donation.create({
    data: {
      organisationId: orgId,
      donorName: data.donorName || null,
      amount: data.amount,
      scheme: data.scheme,
      method: data.method,
      donatedOn: new Date(data.donatedOn),
    },
  });

  return NextResponse.json({ id: donation.id });
}
