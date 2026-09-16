"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ObligationCompleteButton({
  orgId,
  grantId,
  obligationId,
}: {
  orgId: string;
  grantId: string;
  obligationId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/organisations/${orgId}/grants/${grantId}/reporting-obligations/${obligationId}/complete`,
      { method: "POST" }
    );
    setLoading(false);
    if (res.ok) router.refresh();
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="rounded-md border border-gray-300 px-2 py-0.5 text-xs hover:bg-gray-50 disabled:opacity-50"
    >
      {loading ? "Saving..." : "Mark done"}
    </button>
  );
}
