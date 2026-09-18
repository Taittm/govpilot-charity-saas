"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function GrantForm({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [funder, setFunder] = useState("");
  const [amount, setAmount] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [status, setStatus] = useState("RESEARCHING");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/organisations/${orgId}/grants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, funder, amount: amount || undefined, applicationDeadline, status }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Could not save. Check the form and try again.");
      return;
    }

    setName("");
    setFunder("");
    setAmount("");
    setApplicationDeadline("");
    setStatus("RESEARCHING");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="mb-8 flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 p-4">
      <h2 className="w-full text-sm font-semibold">Add a funding opportunity</h2>

      <label className="flex flex-col gap-1 text-sm">
        Grant name
        <input
          required
          className="rounded-md border border-gray-300 px-2 py-1.5"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Funder
        <input
          required
          className="rounded-md border border-gray-300 px-2 py-1.5"
          value={funder}
          onChange={(e) => setFunder(e.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Amount (£, optional)
        <input
          type="number"
          min="0"
          step="1"
          className="rounded-md border border-gray-300 px-2 py-1.5"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Application deadline
        <input
          type="date"
          required
          className="rounded-md border border-gray-300 px-2 py-1.5"
          value={applicationDeadline}
          onChange={(e) => setApplicationDeadline(e.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Status
        <select
          className="rounded-md border border-gray-300 px-2 py-1.5"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="RESEARCHING">Researching</option>
          <option value="APPLIED">Applied</option>
          <option value="AWARDED">Awarded</option>
          <option value="DECLINED">Declined</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add grant"}
      </button>

      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}
