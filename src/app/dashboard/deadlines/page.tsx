import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMembershipsForUser } from "@/lib/orgs";
import { getAllDeadlinesForOrganisation } from "@/lib/governance";
import { DeadlineList, type DeadlineWithOrg } from "@/components/DeadlineList";

export default async function AllDeadlinesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const memberships = await getMembershipsForUser(session.user.id);

  const perOrgDeadlines = await Promise.all(
    memberships.map(async (m) => {
      const orgDeadlines = await getAllDeadlinesForOrganisation(m.organisation);
      return orgDeadlines.map((d) => ({
        ...d,
        organisationId: m.organisation.id,
        organisationName: m.organisation.name,
      }));
    })
  );

  const deadlines: DeadlineWithOrg[] = perOrgDeadlines
    .flat()
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <h1 className="mb-1 text-xl font-semibold">All deadlines</h1>
      <p className="mb-6 text-sm text-gray-500">
        Every upcoming compliance, DBS expiry, and policy review deadline across all {memberships.length}{" "}
        organisation{memberships.length === 1 ? "" : "s"} you manage, soonest first.
      </p>
      <DeadlineList deadlines={deadlines} showOrganisation />
    </div>
  );
}
