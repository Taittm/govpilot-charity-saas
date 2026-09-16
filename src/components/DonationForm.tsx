"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DonationForm({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [scheme, setScheme] = useState("GIFT_AID");
  const [method, setMethod] = useState("OTHER");
  const [donatedOn, setDonatedOn] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/organisations/${orgId}/donations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ donorName: donorName || undefined, amount, scheme, method, donatedOn }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not save. Check the form and try again.");
      return;
    }

    setDonorName("");
    setAmount("");
    setDonatedOn("");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="mb-8 flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 p-4">
      <h2 className="w-full text-sm font-semibold">Log a donation</h2>

      <label className="flex flex-col gap-1 text-sm">
        Scheme
        <select
          className="rounded-md border border-gray-300 px-2 py-1.5"
          value={scheme}
          onChange={(e) => setScheme(e.target.value)}
        >
          <option value="GIFT_AID">Gift Aid</option>
          <option value="GASDS">GASDS</option>
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Amount (£)
        <input
          type="number"
          min="0.01"
          step="0.01"
          required
          className="rounded-md border border-gray-300 px-2 py-1.5"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Method
        <select
          className="rounded-md border border-gray-300 px-2 py-1.5"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="OTHER">Other (cheque, bank transfer...)</option>
          <option value="CASH">Cash</option>
          <option value="CONTACTLESS">Contactless</option>
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Donor name {scheme === "GASDS" && "(optional)"}
        <input
          className="rounded-md border border-gray-300 px-2 py-1.5"
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          required={scheme === "GIFT_AID"}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Date
        <input
          type="date"
          required
          className="rounded-md border border-gray-300 px-2 py-1.5"
          value={donatedOn}
          onChange={(e) => setDonatedOn(e.target.value)}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "Saving..." : "Log donation"}
      </button>

      {scheme === "GASDS" && (
        <p className="w-full text-xs text-gray-500">
          GASDS only applies to cash or contactless donations of £30 or less.
        </p>
      )}

      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}
