"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function TemplateEditor({
  orgId,
  filename,
  label,
  initialText,
  groupId,
  readOnly = false,
}: {
  orgId: string;
  filename: string;
  label: string;
  initialText: string;
  groupId: string | null;
  readOnly?: boolean;
}) {
  const router = useRouter();
  const [text, setText] = useState(initialText);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    setError(null);
    setSaved(false);
    setLoading(true);

    const formData = new FormData();
    formData.set("file", new Blob([text], { type: "text/plain" }), filename);
    formData.set("tag", "POLICY");
    if (groupId) formData.set("groupId", groupId);

    const res = await fetch(`/api/organisations/${orgId}/documents`, { method: "POST", body: formData });
    setLoading(false);

    if (!res.ok) {
      setError("Could not save.");
      return;
    }

    setSaved(true);
    router.refresh();
  };

  return (
    <div className="mb-8 rounded-lg border border-gray-200 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">{label}</h2>
        {readOnly ? (
          <span className="text-xs text-gray-500">Read only</span>
        ) : (
          <div className="flex items-center gap-2">
            {saved && <span className="text-xs text-green-700">Saved to document vault</span>}
            <button
              onClick={onSave}
              disabled={loading}
              className="rounded-md bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save to document vault"}
            </button>
          </div>
        )}
      </div>
      <textarea
        className="h-64 w-full rounded-md border border-gray-300 p-3 font-mono text-xs disabled:bg-gray-50 disabled:text-gray-500"
        value={text}
        disabled={readOnly}
        onChange={(e) => {
          setText(e.target.value);
          setSaved(false);
        }}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
