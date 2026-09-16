"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TAG_LABELS: Record<string, string> = {
  GOVERNING_DOCUMENT: "Governing document",
  PAST_FILING: "Past filing",
  POLICY: "Policy",
  OTHER: "Other",
};

export function DocumentUploadForm({
  orgId,
  existingGroups,
}: {
  orgId: string;
  existingGroups: { groupId: string; label: string }[];
}) {
  const router = useRouter();
  const [tag, setTag] = useState("GOVERNING_DOCUMENT");
  const [groupId, setGroupId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) {
      setError("Choose a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.set("file", fileInput.files[0]);
    formData.set("tag", tag);
    if (groupId) formData.set("groupId", groupId);

    setLoading(true);
    const res = await fetch(`/api/organisations/${orgId}/documents`, { method: "POST", body: formData });
    setLoading(false);

    if (!res.ok) {
      setError("Upload failed. Please try again.");
      return;
    }

    form.reset();
    setGroupId("");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="mb-8 flex flex-col gap-3 rounded-lg border border-gray-200 p-4">
      <h2 className="text-sm font-semibold">Upload a document</h2>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">
          File
          <input name="file" type="file" required className="text-sm" />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Tag
          <select
            className="rounded-md border border-gray-300 px-2 py-1.5"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          >
            {Object.entries(TAG_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          New version of
          <select
            className="rounded-md border border-gray-300 px-2 py-1.5"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
          >
            <option value="">— New document —</option>
            {existingGroups.map((g) => (
              <option key={g.groupId} value={g.groupId}>
                {g.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
