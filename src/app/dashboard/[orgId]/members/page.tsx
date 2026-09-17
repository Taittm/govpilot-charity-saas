import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMembership } from "@/lib/orgs";
import { listMembers, listPendingInvitations } from "@/lib/invitations";
import { canManageMembers, ROLE_LABEL } from "@/lib/permissions";
import { InviteMemberForm } from "@/components/InviteMemberForm";
import { MemberActions } from "@/components/MemberActions";
import { RevokeInvitationButton } from "@/components/RevokeInvitationButton";

function fmt(date: Date) {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function MembersPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) notFound();

  if (!canManageMembers(membership.role)) {
    return (
      <div className="max-w-2xl">
        <h1 className="mb-1 text-xl font-semibold">Members</h1>
        <p className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          Only a consultant/admin can manage who has access to {membership.organisation.name}.
        </p>
      </div>
    );
  }

  const [members, invitations] = await Promise.all([listMembers(orgId), listPendingInvitations(orgId)]);

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-xl font-semibold">Members</h1>
      <p className="mb-6 text-sm text-gray-500">Who has access to {membership.organisation.name}, and at what level.</p>

      <InviteMemberForm orgId={orgId} />

      <h2 className="mb-2 text-sm font-semibold">Current members</h2>
      <ul className="mb-8 flex flex-col gap-2">
        {members.map((m) => (
          <li
            key={m.id}
            className="flex items-center justify-between rounded-md border border-gray-200 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium">{m.user.name ?? m.user.email}</p>
              <p className="text-xs text-gray-500">{m.user.email}</p>
            </div>
            <MemberActions
              orgId={orgId}
              membershipId={m.id}
              currentRole={m.role}
              isSelf={m.userId === session.user.id}
            />
          </li>
        ))}
      </ul>

      {invitations.length > 0 && (
        <>
          <h2 className="mb-2 text-sm font-semibold">Pending invitations</h2>
          <ul className="flex flex-col gap-2">
            {invitations.map((inv) => (
              <li
                key={inv.id}
                className="flex items-center justify-between rounded-md border border-gray-200 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{inv.email}</p>
                  <p className="text-xs text-gray-500">
                    {ROLE_LABEL[inv.role]} · invited {fmt(inv.createdAt)} · expires {fmt(inv.expiresAt)}
                  </p>
                </div>
                <RevokeInvitationButton orgId={orgId} invitationId={inv.id} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
