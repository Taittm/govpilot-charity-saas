import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMembership } from "@/lib/orgs";
import { listDataBreaches } from "@/lib/data-protection";
import { canWrite } from "@/lib/permissions";
import { DataProtectionSubNav } from "@/components/DataProtectionSubNav";
import { BreachForm } from "@/components/BreachForm";

export default async function BreachesPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) notFound();

  const breaches = await listDataBreaches(orgId);

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-xl font-semibold">Data protection</h1>
      <p className="mb-6 text-sm text-gray-500">{membership.organisation.name}</p>
      <DataProtectionSubNav orgId={orgId} active="/breaches" />

      {canWrite(membership.role) && <BreachForm orgId={orgId} />}

      {breaches.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          No breaches logged.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {breaches.map((b) => (
            <li key={b.id} className="rounded-md border border-gray-200 px-4 py-3">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm font-medium">
                  {b.occurredOn.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    b.reportedToIco ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {b.reportedToIco ? "Reported to ICO" : "Not reported to ICO"}
                </span>
              </div>
              <p className="text-sm text-gray-700">{b.description}</p>
              <p className="mt-1 text-xs text-gray-500">Action taken: {b.actionTaken}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
