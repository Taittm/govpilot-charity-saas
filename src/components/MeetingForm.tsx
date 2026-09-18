"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function MeetingForm({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [type, setType] = useState("BOARD_MEETING");
  const [title, setTitle] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/organisations/${orgId}/meetings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, title, scheduledFor }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Could not save. Check the form and try again.");
      return;
    }

    setTitle("");
    setScheduledFor("");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="mb-8 flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 p-4">
      <h2 className="w-full text-sm font-semibold">Schedule a meeting</h2>

      <label className="flex flex-col gap-1 text-sm">
        Type
        <select
          className="rounded-md border border-gray-300 px-2 py-1.5"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="BOARD_MEETING">Board meeting</option>
          <option value="AGM">AGM</option>
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Title
        <input
          required
          className="rounded-md border border-gray-300 px-2 py-1.5"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Q3 board meeting"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Date
        <input
          type="date"
          required
          className="rounded-md border border-gray-300 px-2 py-1.5"
          value={scheduledFor}
          onChange={(e) => setScheduledFor(e.target.value)}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add meeting"}
      </button>

      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}
