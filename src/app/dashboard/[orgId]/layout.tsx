import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/auth";
import { getMembership } from "@/lib/orgs";
import { canManageMembers } from "@/lib/permissions";
import { DashboardSidebarNav } from "@/components/DashboardSidebarNav";

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
    <div className="flex min-h-[calc(100vh-57px)] bg-white">
      <aside className="w-60 shrink-0 border-r border-slate-100 bg-slate-50/60 px-4 py-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Organisation</p>
          <p className="font-semibold text-slate-900">{organisation.name}</p>
          <p className="text-xs text-slate-500">
            {organisation.type} · your role: {membership.role.replace("_", " ").toLowerCase()}
          </p>
        </div>
        <DashboardSidebarNav orgId={orgId} showMembers={canManageMembers(membership.role)} />
      </aside>
      <div className="flex-1 bg-white px-8 py-6">{children}</div>
    </div>
  );
}
