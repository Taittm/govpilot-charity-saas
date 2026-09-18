"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const incomeBandLabels: Record<string, string> = {
  UNDER_10K: "Under £10,000",
  BETWEEN_10K_25K: "£10,000 – £25,000",
  OVER_25K: "£25,000 – £250,000",
  OVER_250K: "£250,000 – £1,000,000",
  OVER_1M: "Over £1,000,000",
};

export default function NewOrganisationPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState<"CHARITY" | "CIC" | "BOTH">("CHARITY");
  const [incomeBand, setIncomeBand] = useState<keyof typeof incomeBandLabels>("UNDER_10K");
  const [financialYearEnd, setFinancialYearEnd] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/organisations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type, incomeBand, financialYearEnd }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Could not create organisation. Check the form and try again.");
      return;
    }

    const data = await res.json();
    router.push(`/dashboard/${data.id}`);
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <h1 className="mb-1 text-xl font-semibold">Add an organisation</h1>
      <p className="mb-6 text-sm text-gray-500">
        Every compliance deadline is derived from these details, so get the type, income band, and year end right.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Organisation name
          <input
            required
            className="rounded-md border border-gray-300 px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Type
          <select
            className="rounded-md border border-gray-300 px-3 py-2"
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
          >
            <option value="CHARITY">Charity</option>
            <option value="CIC">CIC (Community Interest Company)</option>
            <option value="BOTH">Both</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Income band
          <select
            className="rounded-md border border-gray-300 px-3 py-2"
            value={incomeBand}
            onChange={(e) => setIncomeBand(e.target.value as typeof incomeBand)}
          >
            {Object.entries(incomeBandLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Financial year end
          <input
            type="date"
            required
            className="rounded-md border border-gray-300 px-3 py-2"
            value={financialYearEnd}
            onChange={(e) => setFinancialYearEnd(e.target.value)}
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 hover:bg-blue-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create organisation"}
        </button>
      </form>
    </div>
  );
}
