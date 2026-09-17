import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMembership } from "@/lib/orgs";
import { listConflictsOfInterest } from "@/lib/governance";
import { canWrite } from "@/lib/permissions";
import { GovernanceSubNav } from "@/components/GovernanceSubNav";
import { ConflictForm } from "@/components/ConflictForm";

export default async function ConflictsPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) notFound();

  const conflicts = await listConflictsOfInterest(orgId);

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-xl font-semibold">Governance</h1>
      <p className="mb-6 text-sm text-gray-500">{membership.organisation.name}</p>
      <GovernanceSubNav orgId={orgId} active="/conflicts" />

      {canWrite(membership.role) && <ConflictForm orgId={orgId} />}

      {conflicts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          No conflicts of interest declared yet.
        </div>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-400">
              <th className="py-2">Person</th>
              <th className="py-2">Interest</th>
              <th className="py-2">Declared</th>
            </tr>
          </thead>
          <tbody>
            {conflicts.map((c) => (
              <tr key={c.id} className="border-b border-gray-100">
                <td className="py-2 font-medium">{c.personName}</td>
                <td className="py-2">{c.interest}</td>
                <td className="py-2">
                  {c.declaredOn.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
