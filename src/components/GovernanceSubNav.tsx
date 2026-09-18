const TABS = [
  { href: "", label: "Overview" },
  { href: "/trustees", label: "Trustees" },
  { href: "/meetings", label: "Meetings" },
  { href: "/conflicts", label: "Conflicts of interest" },
  { href: "/policies", label: "Policies" },
];

export function GovernanceSubNav({ orgId, active }: { orgId: string; active: string }) {
  return (
    <div className="mb-6 flex gap-1 border-b border-slate-200">
      {TABS.map((tab) => (
        <a
          key={tab.href}
          href={`/dashboard/${orgId}/governance${tab.href}`}
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
