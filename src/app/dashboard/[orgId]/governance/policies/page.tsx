import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMembership } from "@/lib/orgs";
import { listPolicies } from "@/lib/governance";
import { GovernanceSubNav } from "@/components/GovernanceSubNav";
import { PolicyForm } from "@/components/PolicyForm";

export default async function PoliciesPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) notFound();

  const policies = await listPolicies(orgId);
  const now = new Date();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-xl font-semibold">Governance</h1>
      <p className="mb-6 text-sm text-gray-500">{membership.organisation.name}</p>
      <GovernanceSubNav orgId={orgId} active="/policies" />

      <PolicyForm orgId={orgId} />

      <p className="mb-2 text-xs text-gray-500">
        Policy documents themselves live in the{" "}
        <a href={`/dashboard/${orgId}/documents`} className="underline">
          document vault
        </a>{" "}
        (tag: Policy) — this list just tracks review dates and feeds the compliance calendar.
      </p>

      {policies.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          No policies tracked yet.
        </div>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-400">
              <th className="py-2">Policy</th>
              <th className="py-2">Review due</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((p) => {
              const overdue = p.reviewDueOn < now;
              return (
                <tr key={p.id} className="border-b border-gray-100">
                  <td className="py-2 font-medium">{p.name}</td>
                  <td className="py-2">
                    {p.reviewDueOn.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="py-2">
                    {overdue ? (
                      <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                        Overdue for review
                      </span>
                    ) : (
                      <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                        Up to date
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
