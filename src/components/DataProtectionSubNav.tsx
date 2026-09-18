const TABS = [
  { href: "", label: "Overview" },
  { href: "/ico", label: "ICO registration" },
  { href: "/templates", label: "Templates" },
  { href: "/breaches", label: "Breach log" },
  { href: "/sars", label: "Subject access requests" },
];

export function DataProtectionSubNav({ orgId, active }: { orgId: string; active: string }) {
  return (
    <div className="mb-6 flex flex-wrap gap-1 border-b border-slate-200">
      {TABS.map((tab) => (
        <a
          key={tab.href}
          href={`/dashboard/${orgId}/data-protection${tab.href}`}
          className={`-mb-px border-b-2 px-3 py-2 text-sm ${
            active === tab.href
              ? "border-blue-600 font-semibold text-blue-700"
              : "border-transparent text-slate-500 hover:text-blue-600"
          }`}
        >
          {tab.label}
        </a>
      ))}
    </div>
  );
}
