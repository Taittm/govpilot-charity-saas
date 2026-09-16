"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function IcoRegistrationForm({
  orgId,
  initialTier,
  initialRenewalOn,
}: {
  orgId: string;
  initialTier: string;
  initialRenewalOn: string;
}) {
  const router = useRouter();
  const [tier, setTier] = useState(initialTier);
  const [renewalOn, setRenewalOn] = useState(initialRenewalOn);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/organisations/${orgId}/ico-registration`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier, renewalOn: renewalOn || undefined }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Could not save. Check the form and try again.");
      return;
    }

    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="mb-8 flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 p-4">
      <h2 className="w-full text-sm font-semibold">ICO registration</h2>

      <label className="flex flex-col gap-1 text-sm">
        Fee tier
        <select
          className="rounded-md border border-gray-300 px-2 py-1.5"
          value={tier}
          onChange={(e) => setTier(e.target.value)}
        >
          <option value="TIER_1">Tier 1 — £52/year</option>
          <option value="TIER_2">Tier 2 — £78/year</option>
          <option value="TIER_3">Tier 3 — £3,763/year</option>
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Renewal date
        <input
          type="date"
          className="rounded-md border border-gray-300 px-2 py-1.5"
          value={renewalOn}
          onChange={(e) => setRenewalOn(e.target.value)}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save"}
      </button>

      {error && <p className="w-full text-sm text-red-600">{error}</p>}

      <p className="w-full text-xs text-gray-500">
        Charities pay Tier 1 (£52) regardless of size, unless exempt. CICs and other
        organisations may sit in a different tier — check the ICO&apos;s{" "}
        <a
          href="https://ico.org.uk/for-organisations/data-protection-fee/self-assessment/"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          fee self-assessment tool
        </a>{" "}
        if unsure. Leaving the renewal date blank uses this organisation&apos;s record-creation
        anniversary as a placeholder.
      </p>
    </form>
  );
}
