import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getInvitationByToken } from "@/lib/invitations";
import { ROLE_LABEL } from "@/lib/permissions";
import { AcceptInviteButton } from "@/components/AcceptInviteButton";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const session = await auth();
  if (!session) redirect(`/login?callbackUrl=/invite/${token}`);

  const invitation = await getInvitationByToken(token);

  if (!invitation) {
    return <InviteMessage title="Invitation not found" body="This invite link doesn't match any invitation." />;
  }
  if (invitation.acceptedAt) {
    return <InviteMessage title="Already used" body="This invitation has already been accepted." />;
  }
  if (invitation.expiresAt < new Date()) {
    return (
      <InviteMessage
        title="Invitation expired"
        body="This invite link has expired. Ask whoever sent it to send a new one."
      />
    );
  }

  const emailMismatch = invitation.email.toLowerCase() !== session.user.email?.toLowerCase();

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <h1 className="mb-1 text-2xl font-semibold">You&apos;ve been invited</h1>
      <p className="mb-6 text-sm text-gray-500">
        {invitation.invitedBy.name ?? invitation.invitedBy.email} has invited you to join{" "}
        <span className="font-medium text-gray-900">{invitation.organisation.name}</span> as{" "}
        <span className="font-medium text-gray-900">{ROLE_LABEL[invitation.role]}</span>.
      </p>

      {emailMismatch ? (
        <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
          This invitation was sent to <strong>{invitation.email}</strong>, but you&apos;re logged in as{" "}
          {session.user.email}. Log out and log in with {invitation.email} to accept it.
        </p>
      ) : (
        <AcceptInviteButton token={token} />
      )}
    </div>
  );
}

function InviteMessage({ title, body }: { title: string; body: string }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 text-center">
      <h1 className="mb-2 text-xl font-semibold">{title}</h1>
      <p className="text-sm text-gray-500">{body}</p>
    </div>
  );
}
