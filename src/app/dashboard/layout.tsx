import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/auth";
import { getMembershipsForUser } from "@/lib/orgs";
import { OrgSwitcher } from "@/components/OrgSwitcher";
import { SignOutButton } from "@/components/SignOutButton";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const memberships = await getMembershipsForUser(session.user.id);
  const options = memberships.map((m) => ({
    organisationId: m.organisationId,
    organisationName: m.organisation.name,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <header className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-3">
        <a href="/dashboard" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            CH
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            Compliance Hub
          </span>
        </a>
        <div className="flex items-center gap-4">
          {options.length > 0 && (
            <a
              href="/dashboard/deadlines"
              className="text-sm font-medium text-slate-600 hover:text-blue-700"
            >
              All deadlines
            </a>
          )}
          {options.length > 0 && <OrgSwitcher options={options} />}
          <span className="text-sm text-slate-500">{session.user.email}</span>
          <SignOutButton />
        </div>
      </header>
      <main className="flex-1 bg-white">{children}</main>
    </div>
  );
}
