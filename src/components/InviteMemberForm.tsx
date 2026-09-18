"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROLE_OPTIONS, ROLE_LABEL } from "@/lib/permissions";

export function InviteMemberForm({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("STAFF");
  const [error, setError] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInviteUrl(null);
    setCopied(false);
    setLoading(true);

    const res = await fetch(`/api/organisations/${orgId}/members/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not create the invitation.");
      return;
    }

    const data = await res.json();
    setInviteUrl(data.url);
    setEmail("");
    router.refresh();
  };

  const copyLink = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
    } catch {
      // Clipboard access can fail (permissions, insecure context); the link is still shown to copy manually.
    }
  };

  return (
    <form onSubmit={onSubmit} className="mb-8 flex flex-col gap-3 rounded-lg border border-gray-200 p-4">
      <h2 className="text-sm font-semibold">Invite someone</h2>
      <p className="text-xs text-gray-500">
        There&apos;s no automatic email — you&apos;ll get a link to copy and send yourself.
      </p>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            required
            className="rounded-md border border-gray-300 px-2 py-1.5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Role
          <select
            className="rounded-md border border-gray-300 px-2 py-1.5"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create invite link"}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {inviteUrl && (
        <div className="flex flex-wrap items-center gap-2 rounded-md bg-gray-50 p-3">
          <code className="flex-1 break-all text-xs">{inviteUrl}</code>
          <button
            type="button"
            onClick={copyLink}
            className="rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-white"
          >
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      )}
    </form>
  );
}
