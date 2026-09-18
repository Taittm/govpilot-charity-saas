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
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
        <a href="/dashboard" className="font-semibold">
          Compliance Hub
        </a>
        <div className="flex items-center gap-4">
          {options.length > 0 && (
            <a href="/dashboard/deadlines" className="text-sm text-gray-700 hover:underline">
              All deadlines
            </a>
          )}
          {options.length > 0 && <OrgSwitcher options={options} />}
          <span className="text-sm text-gray-500">{session.user.email}</span>
          <SignOutButton />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
