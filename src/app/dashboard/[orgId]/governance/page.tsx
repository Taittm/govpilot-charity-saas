import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMembership } from "@/lib/orgs";
import { listTrustees, listMeetings, listConflictsOfInterest, listPolicies } from "@/lib/governance";
import { GovernanceSubNav } from "@/components/GovernanceSubNav";

export default async function GovernancePage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) notFound();

  const [trustees, meetings, conflicts, policies] = await Promise.all([
    listTrustees(orgId),
    listMeetings(orgId),
    listConflictsOfInterest(orgId),
    listPolicies(orgId),
  ]);

  const overduePolicies = policies.filter((p) => p.reviewDueOn < new Date()).length;

  const cards = [
    { href: "trustees", label: "Trustees & directors", count: trustees.length, note: "register + DBS tracking" },
    { href: "meetings", label: "Meetings", count: meetings.length, note: "board meetings, AGMs, minutes" },
    { href: "conflicts", label: "Conflicts of interest", count: conflicts.length, note: "declared interests" },
    {
      href: "policies",
      label: "Policies",
      count: policies.length,
      note: overduePolicies > 0 ? `${overduePolicies} overdue for review` : "review dates tracked",
      warn: overduePolicies > 0,
    },
  ];

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-xl font-semibold">Governance</h1>
      <p className="mb-6 text-sm text-gray-500">
        Trustee register, meetings, conflicts of interest, and policy library for {membership.organisation.name}.
      </p>

      <GovernanceSubNav orgId={orgId} active="" />

      <div className="grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <a
            key={c.href}
            href={`/dashboard/${orgId}/governance/${c.href}`}
            className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
          >
            <p className="text-sm font-medium">{c.label}</p>
            <p className="text-2xl font-semibold">{c.count}</p>
            <p className={`text-xs ${c.warn ? "font-medium text-red-600" : "text-gray-500"}`}>{c.note}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
