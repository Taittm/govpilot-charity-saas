import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMembership } from "@/lib/orgs";
import { getIcoRegistration, listDataBreaches, listSubjectAccessRequests } from "@/lib/data-protection";
import { ICO_FEE_LABEL, ICO_TIER_LABEL } from "@/lib/ico";
import { DataProtectionSubNav } from "@/components/DataProtectionSubNav";

export default async function DataProtectionPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) notFound();

  const [ico, breaches, sars] = await Promise.all([
    getIcoRegistration(orgId),
    listDataBreaches(orgId),
    listSubjectAccessRequests(orgId),
  ]);

  const openSars = sars.filter((s) => s.status === "OPEN");
  const overdueSars = openSars.filter((s) => s.dueOn < new Date());

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-xl font-semibold">Data protection</h1>
      <p className="mb-6 text-sm text-gray-500">
        ICO registration, privacy/retention templates, breach log, and subject access requests for{" "}
        {membership.organisation.name}.
      </p>
      <DataProtectionSubNav orgId={orgId} active="" />

      <div className="grid grid-cols-2 gap-3">
        <a
          href={`/dashboard/${orgId}/data-protection/ico`}
          className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
        >
          <p className="text-sm font-medium">ICO registration</p>
          <p className="text-lg font-semibold">{ico ? ICO_TIER_LABEL[ico.tier] : "Not set"}</p>
          <p className="text-xs text-gray-500">{ico ? ICO_FEE_LABEL[ico.tier] : "Defaults to Tier 1, £52/year"}</p>
        </a>

        <a
          href={`/dashboard/${orgId}/data-protection/sars`}
          className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
        >
          <p className="text-sm font-medium">Subject access requests</p>
          <p className="text-lg font-semibold">{openSars.length} open</p>
          <p className={`text-xs ${overdueSars.length > 0 ? "font-medium text-red-600" : "text-gray-500"}`}>
            {overdueSars.length > 0 ? `${overdueSars.length} overdue` : "None overdue"}
          </p>
        </a>

        <a
          href={`/dashboard/${orgId}/data-protection/breaches`}
          className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
        >
          <p className="text-sm font-medium">Breach log</p>
          <p className="text-lg font-semibold">{breaches.length} logged</p>
          <p className="text-xs text-gray-500">
            {breaches.filter((b) => b.reportedToIco).length} reported to the ICO
          </p>
        </a>

        <a
          href={`/dashboard/${orgId}/data-protection/templates`}
          className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
        >
          <p className="text-sm font-medium">Templates</p>
          <p className="text-lg font-semibold">Privacy notice & retention policy</p>
          <p className="text-xs text-gray-500">Edit and save to the document vault</p>
        </a>
      </div>
    </div>
  );
}
