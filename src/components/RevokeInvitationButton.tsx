"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RevokeInvitationButton({ orgId, invitationId }: { orgId: string; invitationId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const revoke = async () => {
    setLoading(true);
    const res = await fetch(`/api/organisations/${orgId}/invitations/${invitationId}/revoke`, { method: "POST" });
    setLoading(false);
    if (res.ok) router.refresh();
  };

  return (
    <button
      onClick={revoke}
      disabled={loading}
      className="rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
    >
      {loading ? "Revoking..." : "Revoke"}
    </button>
  );
}
