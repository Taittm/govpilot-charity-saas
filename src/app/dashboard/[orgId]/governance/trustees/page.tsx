import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMembership } from "@/lib/orgs";
import { listTrustees } from "@/lib/governance";
import { GovernanceSubNav } from "@/components/GovernanceSubNav";
import { TrusteeForm } from "@/components/TrusteeForm";

const DBS_LABEL: Record<string, string> = {
  NONE: "None",
  BASIC: "Basic",
  STANDARD: "Standard",
  ENHANCED: "Enhanced",
};

function fmt(date: Date | null) {
  if (!date) return "—";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function TrusteesPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) notFound();

  const trustees = await listTrustees(orgId);
  const now = new Date();

  return (
    <div className="max-w-4xl">
      <h1 className="mb-1 text-xl font-semibold">Governance</h1>
      <p className="mb-6 text-sm text-gray-500">{membership.organisation.name}</p>
      <GovernanceSubNav orgId={orgId} active="/trustees" />

      <TrusteeForm orgId={orgId} />

      {trustees.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          No trustees or directors added yet.
        </div>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-400">
              <th className="py-2">Name</th>
              <th className="py-2">Role</th>
              <th className="py-2">Appointed</th>
              <th className="py-2">Term ends</th>
              <th className="py-2">DBS check</th>
              <th className="py-2">DBS expires</th>
            </tr>
          </thead>
          <tbody>
            {trustees.map((t) => {
              const expired = t.dbsExpiresOn && t.dbsExpiresOn < now;
              return (
                <tr key={t.id} className="border-b border-gray-100">
                  <td className="py-2 font-medium">{t.name}</td>
                  <td className="py-2">{t.role}</td>
                  <td className="py-2">{fmt(t.appointedOn)}</td>
                  <td className="py-2">{fmt(t.termEndsOn)}</td>
                  <td className="py-2">{DBS_LABEL[t.dbsCheckType]}</td>
                  <td className={`py-2 ${expired ? "font-medium text-red-600" : ""}`}>
                    {fmt(t.dbsExpiresOn)}
                    {expired ? " (expired)" : ""}
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
