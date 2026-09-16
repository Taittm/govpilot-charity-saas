"use client";

export function PrintButton({ label = "Print / Save as PDF" }: { label?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white print:hidden"
    >
      {label}
    </button>
  );
}
