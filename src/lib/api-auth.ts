import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import { getMembership } from "@/lib/orgs";
import { canWrite, canManageMembers } from "@/lib/permissions";

type Membership = NonNullable<Awaited<ReturnType<typeof getMembership>>>;
type AuthFailure = { error: NextResponse };
type AuthSuccess = { session: Session; membership: Membership };

// Combines the three checks nearly every mutating API route needs — signed
// in, a member of this organisation, and that membership's role allows
// writes — into one call so route handlers don't repeat the boilerplate.
export async function requireWriteMembership(organisationId: string): Promise<AuthFailure | AuthSuccess> {
  const session = await auth();
  if (!session) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  const membership = await getMembership(session.user.id, organisationId);
  if (!membership) return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) };

  if (!canWrite(membership.role)) {
    return {
      error: NextResponse.json(
        { error: "You have read-only access to this organisation." },
        { status: 403 }
      ),
    };
  }

  return { session, membership };
}

export async function requireMemberManagement(organisationId: string): Promise<AuthFailure | AuthSuccess> {
  const session = await auth();
  if (!session) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  const membership = await getMembership(session.user.id, organisationId);
  if (!membership) return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) };

  if (!canManageMembers(membership.role)) {
    return {
      error: NextResponse.json(
        { error: "Only a consultant/admin can manage members." },
        { status: 403 }
      ),
    };
  }

  return { session, membership };
}

export function isAuthFailure<T>(result: AuthFailure | T): result is AuthFailure {
  return (result as AuthFailure).error !== undefined;
}
