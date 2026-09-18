"use client";

import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Overview", href: "" },
  { label: "Health Check", href: "/health-check" },
  { label: "Compliance Calendar", href: "/calendar" },
  { label: "Documents", href: "/documents" },
  { label: "Governance", href: "/governance" },
  { label: "Financial", href: "/financial" },
  { label: "Data Protection", href: "/data-protection" },
  { label: "Grants", href: "/grants" },
];

export function DashboardSidebarNav({ orgId, showMembers }: { orgId: string; showMembers: boolean }) {
  const pathname = usePathname();
  const base = `/dashboard/${orgId}`;

  function isActive(href: string) {
    const full = `${base}${href}`;
    return href === "" ? pathname === base : pathname === full || pathname.startsWith(`${full}/`);
  }

  function linkClass(active: boolean) {
    return `rounded-lg px-3 py-2 text-sm font-medium ${
      active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
    }`;
  }

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <a key={item.label} href={`${base}${item.href}`} className={linkClass(isActive(item.href))}>
          {item.label}
        </a>
      ))}
      {showMembers && (
        <a href={`${base}/members`} className={linkClass(isActive("/members"))}>
          Members
        </a>
      )}
    </nav>
  );
}
