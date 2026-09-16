import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMembership } from "@/lib/orgs";
import { getAllDeadlinesForOrganisation } from "@/lib/governance";
import { DeadlineList } from "@/components/DeadlineList";

export default async function OrgCalendarPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) notFound();

  const rawDeadlines = await getAllDeadlinesForOrganisation(membership.organisation);
  const deadlines = rawDeadlines.map((d) => ({
    ...d,
    organisationId: membership.organisation.id,
    organisationName: membership.organisation.name,
  }));

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 text-xl font-semibold">Compliance calendar</h1>
      <p className="mb-6 text-sm text-gray-500">
        Auto-generated from {membership.organisation.name}&apos;s type, income band, and financial year end, plus
        DBS expiry and policy review dates from the governance register.
      </p>
      <DeadlineList deadlines={deadlines} />
    </div>
  );
}
