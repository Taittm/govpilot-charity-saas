"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ConflictForm({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [personName, setPersonName] = useState("");
  const [interest, setInterest] = useState("");
  const [declaredOn, setDeclaredOn] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/organisations/${orgId}/conflicts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personName, interest, declaredOn }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Could not save. Check the form and try again.");
      return;
    }

    setPersonName("");
    setInterest("");
    setDeclaredOn("");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="mb-8 flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 p-4">
      <h2 className="w-full text-sm font-semibold">Declare a conflict of interest</h2>

      <label className="flex flex-col gap-1 text-sm">
        Person
        <input
          required
          className="rounded-md border border-gray-300 px-2 py-1.5"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
        />
      </label>

      <label className="flex min-w-64 flex-1 flex-col gap-1 text-sm">
        Interest
        <input
          required
          className="rounded-md border border-gray-300 px-2 py-1.5"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          placeholder="e.g. Director of a supplier the charity uses"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Declared on
        <input
          type="date"
          required
          className="rounded-md border border-gray-300 px-2 py-1.5"
          value={declaredOn}
          onChange={(e) => setDeclaredOn(e.target.value)}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add"}
      </button>

      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}
