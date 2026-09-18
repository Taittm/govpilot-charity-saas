"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function FinancialYearForm({ orgId, defaultYearEndOn }: { orgId: string; defaultYearEndOn?: string }) {
  const router = useRouter();
  const [yearEndOn, setYearEndOn] = useState(defaultYearEndOn ?? "");
  const [income, setIncome] = useState("");
  const [assets, setAssets] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/organisations/${orgId}/financial-years`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ yearEndOn, income, assets: assets || undefined }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Could not save. Check the form and try again.");
      return;
    }

    setIncome("");
    setAssets("");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="mb-8 flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 p-4">
      <h2 className="w-full text-sm font-semibold">Enter a financial year</h2>

      <label className="flex flex-col gap-1 text-sm">
        Year end
        <input
          type="date"
          required
          className="rounded-md border border-gray-300 px-2 py-1.5"
          value={yearEndOn}
          onChange={(e) => setYearEndOn(e.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Income (£)
        <input
          type="number"
          min="0"
          step="1"
          required
          className="rounded-md border border-gray-300 px-2 py-1.5"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Assets (£, optional)
        <input
          type="number"
          min="0"
          step="1"
          className="rounded-md border border-gray-300 px-2 py-1.5"
          value={assets}
          onChange={(e) => setAssets(e.target.value)}
          placeholder="for audit threshold"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "Calculating..." : "Calculate"}
      </button>

      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}
