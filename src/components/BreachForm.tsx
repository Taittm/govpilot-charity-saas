"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BreachForm({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [occurredOn, setOccurredOn] = useState("");
  const [description, setDescription] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [reportedToIco, setReportedToIco] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/organisations/${orgId}/breaches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ occurredOn, description, actionTaken, reportedToIco }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Could not save. Check the form and try again.");
      return;
    }

    setOccurredOn("");
    setDescription("");
    setActionTaken("");
    setReportedToIco(false);
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="mb-8 flex flex-col gap-3 rounded-lg border border-gray-200 p-4">
      <h2 className="text-sm font-semibold">Log a data breach</h2>

      <div className="flex flex-wrap gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Date occurred
          <input
            type="date"
            required
            className="rounded-md border border-gray-300 px-2 py-1.5"
            value={occurredOn}
            onChange={(e) => setOccurredOn(e.target.value)}
          />
        </label>
        <label className="mt-6 flex items-center gap-1.5 text-sm">
          <input type="checkbox" checked={reportedToIco} onChange={(e) => setReportedToIco(e.target.checked)} />
          Reported to the ICO
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Description
        <textarea
          required
          className="rounded-md border border-gray-300 px-2 py-1.5"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Action taken
        <textarea
          required
          className="rounded-md border border-gray-300 px-2 py-1.5"
          rows={2}
          value={actionTaken}
          onChange={(e) => setActionTaken(e.target.value)}
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="self-start rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "Saving..." : "Log breach"}
      </button>
    </form>
  );
}
