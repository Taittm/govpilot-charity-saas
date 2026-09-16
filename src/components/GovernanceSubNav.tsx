const TABS = [
  { href: "", label: "Overview" },
  { href: "/trustees", label: "Trustees" },
  { href: "/meetings", label: "Meetings" },
  { href: "/conflicts", label: "Conflicts of interest" },
  { href: "/policies", label: "Policies" },
];

export function GovernanceSubNav({ orgId, active }: { orgId: string; active: string }) {
  return (
    <div className="mb-6 flex gap-1 border-b border-gray-200">
      {TABS.map((tab) => (
        <a
          key={tab.href}
          href={`/dashboard/${orgId}/governance${tab.href}`}
          className={`-mb-px border-b-2 px-3 py-2 text-sm ${
            active === tab.href
              ? "border-gray-900 font-medium text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          {tab.label}
        </a>
      ))}
    </div>
  );
}
