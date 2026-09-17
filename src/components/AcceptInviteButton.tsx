"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AcceptInviteButton({ token }: { token: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const accept = async () => {
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/invitations/${token}/accept`, { method: "POST" });
    const data = await res.json().catch(() => ({}));

    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Could not accept this invitation.");
      return;
    }

    router.push(`/dashboard/${data.organisationId}`);
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={accept}
        disabled={loading}
        className="self-start rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "Joining..." : "Accept invitation"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
