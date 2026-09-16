"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function TrusteeForm({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("Trustee");
  const [appointedOn, setAppointedOn] = useState("");
  const [termEndsOn, setTermEndsOn] = useState("");
  const [dbsCheckType, setDbsCheckType] = useState("NONE");
  const [dbsCheckedOn, setDbsCheckedOn] = useState("");
  const [dbsExpiresOn, setDbsExpiresOn] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/organisations/${orgId}/trustees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        role,
        appointedOn,
        termEndsOn: termEndsOn || undefined,
        dbsCheckType,
        dbsCheckedOn: dbsCheckedOn || undefined,
        dbsExpiresOn: dbsExpiresOn || undefined,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Could not save. Check the form and try again.");
      return;
    }

    setName("");
    setRole("Trustee");
    setAppointedOn("");
    setTermEndsOn("");
    setDbsCheckType("NONE");
    setDbsCheckedOn("");
    setDbsExpiresOn("");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="mb-8 flex flex-col gap-3 rounded-lg border border-gray-200 p-4">
      <h2 className="text-sm font-semibold">Add a trustee or director</h2>

      <div className="flex flex-wrap gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Name
          <input
            required
            className="rounded-md border border-gray-300 px-2 py-1.5"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Role
          <input
            required
            className="rounded-md border border-gray-300 px-2 py-1.5"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Chair, Treasurer, Trustee..."
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Appointed on
          <input
            type="date"
            required
            className="rounded-md border border-gray-300 px-2 py-1.5"
            value={appointedOn}
            onChange={(e) => setAppointedOn(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Term ends
          <input
            type="date"
            className="rounded-md border border-gray-300 px-2 py-1.5"
            value={termEndsOn}
            onChange={(e) => setTermEndsOn(e.target.value)}
          />
        </label>
      </div>

      <div className="rounded-md bg-gray-50 p-3">
        <p className="mb-2 text-xs text-gray-500">
          This product doesn&apos;t perform DBS checks — get one done via an{" "}
          <a
            href="https://www.gov.uk/government/organisations/disclosure-and-barring-service"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            external umbrella body
          </a>
          , then record the result here.
        </p>
        <div className="flex flex-wrap gap-3">
          <label className="flex flex-col gap-1 text-sm">
            DBS check type
            <select
              className="rounded-md border border-gray-300 px-2 py-1.5"
              value={dbsCheckType}
              onChange={(e) => setDbsCheckType(e.target.value)}
            >
              <option value="NONE">None</option>
              <option value="BASIC">Basic</option>
              <option value="STANDARD">Standard</option>
              <option value="ENHANCED">Enhanced</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Checked on
            <input
              type="date"
              className="rounded-md border border-gray-300 px-2 py-1.5"
              value={dbsCheckedOn}
              onChange={(e) => setDbsCheckedOn(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Expires on
            <input
              type="date"
              className="rounded-md border border-gray-300 px-2 py-1.5"
              value={dbsExpiresOn}
              onChange={(e) => setDbsExpiresOn(e.target.value)}
            />
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="self-start rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add trustee"}
      </button>
    </form>
  );
}
