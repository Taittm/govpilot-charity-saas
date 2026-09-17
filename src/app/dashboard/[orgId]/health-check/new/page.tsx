import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMembership } from "@/lib/orgs";
import { canWrite } from "@/lib/permissions";
import { HealthCheckForm } from "@/components/HealthCheckForm";

export default async function NewHealthCheckPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) notFound();
  if (!canWrite(membership.role)) redirect(`/dashboard/${orgId}/health-check`);

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-xl font-semibold">Run a health check</h1>
      <p className="mb-6 text-sm text-gray-500">
        Answer every question for {membership.organisation.name}. Each section is scored red/amber/green from
        your answers.
      </p>
      <HealthCheckForm orgId={orgId} />
    </div>
  );
}
