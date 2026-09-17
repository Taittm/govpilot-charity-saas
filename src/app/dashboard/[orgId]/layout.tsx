import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/auth";
import { getMembership } from "@/lib/orgs";
import { canManageMembers } from "@/lib/permissions";

const navItems = [
  { label: "Overview", href: "", enabled: true },
  { label: "Health Check", href: "/health-check", enabled: true },
  { label: "Compliance Calendar", href: "/calendar", enabled: true },
  { label: "Documents", href: "/documents", enabled: true },
  { label: "Governance", href: "/governance", enabled: true },
  { label: "Financial", href: "/financial", enabled: true },
  { label: "Data Protection", href: "/data-protection", enabled: true },
  { label: "Grants", href: "/grants", enabled: true },
];

export default async function OrgLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ orgId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) notFound();

  const { organisation } = membership;

  return (
    <div className="flex min-h-[calc(100vh-57px)]">
      <aside className="w-60 shrink-0 border-r border-gray-200 px-4 py-6">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wide text-gray-400">Organisation</p>
          <p className="font-medium">{organisation.name}</p>
          <p className="text-xs text-gray-500">
            {organisation.type} · your role: {membership.role.replace("_", " ").toLowerCase()}
          </p>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) =>
            item.enabled ? (
              <a
                key={item.label}
                href={`/dashboard/${orgId}${item.href}`}
                className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {item.label}
              </a>
            ) : (
              <span
                key={item.label}
                title="Coming in a later phase"
                className="cursor-not-allowed rounded-md px-3 py-2 text-sm text-gray-400"
              >
                {item.label}
              </span>
            )
          )}
          {canManageMembers(membership.role) && (
            <a
              href={`/dashboard/${orgId}/members`}
              className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Members
            </a>
          )}
        </nav>
      </aside>
      <div className="flex-1 px-8 py-6">{children}</div>
    </div>
  );
}
