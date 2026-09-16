"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SarForm({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [requesterName, setRequesterName] = useState("");
  const [receivedOn, setReceivedOn] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/organisations/${orgId}/sars`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requesterName: requesterName || undefined, receivedOn }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Could not save. Check the form and try again.");
      return;
    }

    setRequesterName("");
    setReceivedOn("");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="mb-8 flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 p-4">
      <h2 className="w-full text-sm font-semibold">Log a subject access request</h2>

      <label className="flex flex-col gap-1 text-sm">
        Requester name (optional)
        <input
          className="rounded-md border border-gray-300 px-2 py-1.5"
          value={requesterName}
          onChange={(e) => setRequesterName(e.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Received on
        <input
          type="date"
          required
          className="rounded-md border border-gray-300 px-2 py-1.5"
          value={receivedOn}
          onChange={(e) => setReceivedOn(e.target.value)}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "Saving..." : "Log request"}
      </button>

      {error && <p className="w-full text-sm text-red-600">{error}</p>}

      <p className="w-full text-xs text-gray-500">
        The statutory due date (one calendar month from receipt) is calculated automatically.
      </p>
    </form>
  );
}
