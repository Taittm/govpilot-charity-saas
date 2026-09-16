"use client";

import { useRouter } from "next/navigation";

export function TaxYearSelect({ years, current }: { years: string[]; current: string }) {
  const router = useRouter();

  return (
    <select
      className="rounded-md border border-gray-300 px-2 py-1 text-sm"
      defaultValue={current}
      onChange={(e) => router.push(`?taxYear=${e.target.value}`)}
    >
      {years.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  );
}
