"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReportingObligationForm({ orgId, grantId }: { orgId: string; grantId: string }) {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [dueOn, setDueOn] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/organisations/${orgId}/grants/${grantId}/reporting-obligations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, dueOn }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Could not save.");
      return;
    }

    setDescription("");
    setDueOn("");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-2">
      <input
        required
        placeholder="e.g. Q1 impact report"
        className="rounded-md border border-gray-300 px-2 py-1 text-xs"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="date"
        required
        className="rounded-md border border-gray-300 px-2 py-1 text-xs"
        value={dueOn}
        onChange={(e) => setDueOn(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add reporting obligation"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </form>
  );
}
