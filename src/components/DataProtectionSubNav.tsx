const TABS = [
  { href: "", label: "Overview" },
  { href: "/ico", label: "ICO registration" },
  { href: "/templates", label: "Templates" },
  { href: "/breaches", label: "Breach log" },
  { href: "/sars", label: "Subject access requests" },
];

export function DataProtectionSubNav({ orgId, active }: { orgId: string; active: string }) {
  return (
    <div className="mb-6 flex flex-wrap gap-1 border-b border-gray-200">
      {TABS.map((tab) => (
        <a
          key={tab.href}
          href={`/dashboard/${orgId}/data-protection${tab.href}`}
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
