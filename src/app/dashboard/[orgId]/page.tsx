import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMembership } from "@/lib/orgs";

const incomeBandLabels: Record<string, string> = {
  UNDER_10K: "Under £10,000",
  BETWEEN_10K_25K: "£10,000 – £25,000",
  OVER_25K: "£25,000 – £250,000",
  OVER_250K: "£250,000 – £1,000,000",
  OVER_1M: "Over £1,000,000",
};

export default async function OrgDashboardPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) notFound();

  const { organisation } = membership;

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold">{organisation.name}</h1>
      <p className="mb-8 text-sm text-gray-500">
        {organisation.type} · {incomeBandLabels[organisation.incomeBand]} · year end{" "}
        {new Date(organisation.financialYearEnd).toLocaleDateString("en-GB")}
      </p>

      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
        This is the dashboard frame for this organisation. Health checks, the compliance calendar, document vault,
        and other modules will appear here as they're built in later phases.
      </div>
    </div>
  );
}
