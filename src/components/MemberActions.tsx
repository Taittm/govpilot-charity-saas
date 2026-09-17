"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROLE_OPTIONS, ROLE_LABEL } from "@/lib/permissions";

export function MemberActions({
  orgId,
  membershipId,
  currentRole,
  isSelf,
}: {
  orgId: string;
  membershipId: string;
  currentRole: string;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [role, setRole] = useState(currentRole);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const changeRole = async (newRole: string) => {
    setRole(newRole);
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/organisations/${orgId}/members/${membershipId}/role`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not change role.");
      setRole(currentRole);
      return;
    }

    router.refresh();
  };

  const remove = async () => {
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/organisations/${orgId}/members/${membershipId}/remove`, { method: "POST" });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not remove member.");
      return;
    }

    router.refresh();
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <select
          className="rounded-md border border-gray-300 px-2 py-1 text-xs"
          value={role}
          disabled={loading}
          onChange={(e) => changeRole(e.target.value)}
        >
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABEL[r]}
            </option>
          ))}
        </select>
        <button
          onClick={remove}
          disabled={loading}
          className="rounded-md border border-gray-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
        >
          {isSelf ? "Leave" : "Remove"}
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
