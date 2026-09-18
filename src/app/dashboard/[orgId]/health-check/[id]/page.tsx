import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getHealthCheckForUser } from "@/lib/health-check/data";
import { HealthCheckReport } from "@/components/HealthCheckReport";

export default async function HealthCheckReportPage({
  params,
}: {
  params: Promise<{ orgId: string; id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { orgId, id } = await params;
  const result = await getHealthCheckForUser(session.user.id, id);
  if (!result || result.healthCheck.organisationId !== orgId) notFound();

  const { healthCheck, sectionScoreMap, previous, previousSectionScoreMap } = result;

  return (
    <div className="max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <a href={`/dashboard/${orgId}/health-check`} className="text-sm text-gray-500 hover:underline">
          ← All health checks
        </a>
        <div className="flex gap-2">
          <a
            href={`/print/health-check/${id}`}
            target="_blank"
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Export PDF
          </a>
          <a
            href={`/print/health-check/${id}/compliance-kit`}
            target="_blank"
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Compliance kit
          </a>
          <a
            href={`/dashboard/${orgId}/health-check/new`}
            className="rounded-md bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-sm font-medium text-white"
          >
            Run again
          </a>
        </div>
      </div>

      <HealthCheckReport
        organisationName={healthCheck.organisation.name}
        version={healthCheck.version}
        createdAt={healthCheck.createdAt}
        createdByLabel={healthCheck.createdBy.name ?? healthCheck.createdBy.email}
        overallScore={healthCheck.overallScore}
        previousOverallScore={previous?.overallScore ?? null}
        sectionScoreMap={sectionScoreMap}
        previousSectionScoreMap={previousSectionScoreMap}
      />
    </div>
  );
}
