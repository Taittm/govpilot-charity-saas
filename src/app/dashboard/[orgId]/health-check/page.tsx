import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMembership } from "@/lib/orgs";
import { listHealthChecksForOrg } from "@/lib/health-check/data";
import { RAG_LABEL, RAG_COLOR } from "@/lib/health-check/scoring";
import { canWrite } from "@/lib/permissions";

export default async function HealthCheckListPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) notFound();

  const checks = await listHealthChecksForOrg(orgId);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Health Check</h1>
          <p className="text-sm text-gray-500">
            Governance, safeguarding, financial controls, data protection, fundraising, and HR/volunteering,
            scored red/amber/green.
          </p>
        </div>
        {canWrite(membership.role) && (
          <a
            href={`/dashboard/${orgId}/health-check/new`}
            className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
          >
            Run health check
          </a>
        )}
      </div>

      {checks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          No health checks have been run for this organisation yet.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {checks.map((check) => {
            const color = RAG_COLOR[check.overallScore];
            return (
              <li key={check.id}>
                <a
                  href={`/dashboard/${orgId}/health-check/${check.id}`}
                  className="flex items-center justify-between rounded-md border border-gray-200 px-4 py-3 text-sm hover:bg-gray-50"
                >
                  <span>
                    Version {check.version} ·{" "}
                    {new Date(check.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    · run by {check.createdBy.name ?? check.createdBy.email}
                  </span>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${color.bg} ${color.text}`}>
                    {RAG_LABEL[check.overallScore]}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
