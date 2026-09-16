"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function MinutesUpload({ orgId, meetingId }: { orgId: string; meetingId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) {
      setError("Choose a file first.");
      return;
    }

    const formData = new FormData();
    formData.set("file", fileInput.files[0]);

    setLoading(true);
    const res = await fetch(`/api/organisations/${orgId}/meetings/${meetingId}/minutes`, {
      method: "POST",
      body: formData,
    });
    setLoading(false);

    if (!res.ok) {
      setError("Upload failed.");
      return;
    }

    form.reset();
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <input name="file" type="file" className="text-xs" required />
      <button
        type="submit"
        disabled={loading}
        className="rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload minutes"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </form>
  );
}
