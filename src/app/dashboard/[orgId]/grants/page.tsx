import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMembership } from "@/lib/orgs";
import { listGrants } from "@/lib/grants";
import { GrantForm } from "@/components/GrantForm";
import { ReportingObligationForm } from "@/components/ReportingObligationForm";
import { ObligationCompleteButton } from "@/components/ObligationCompleteButton";

const STATUS_LABEL: Record<string, string> = {
  RESEARCHING: "Researching",
  APPLIED: "Applied",
  AWARDED: "Awarded",
  DECLINED: "Declined",
  COMPLETED: "Completed",
};

const STATUS_COLOR: Record<string, string> = {
  RESEARCHING: "bg-gray-100 text-gray-600",
  APPLIED: "bg-amber-50 text-amber-700",
  AWARDED: "bg-green-50 text-green-700",
  DECLINED: "bg-red-50 text-red-700",
  COMPLETED: "bg-blue-50 text-blue-700",
};

function fmt(date: Date) {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function GrantsPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) notFound();

  const grants = await listGrants(orgId);
  const now = new Date();

  return (
    <div className="max-w-4xl">
      <h1 className="mb-1 text-xl font-semibold">Grants</h1>
      <p className="mb-6 text-sm text-gray-500">
        Funding opportunities and reporting obligations for {membership.organisation.name}.
      </p>

      <GrantForm orgId={orgId} />

      {grants.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          No grants tracked yet.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {grants.map((g) => (
            <li key={g.id} className="rounded-md border border-gray-200 px-4 py-3">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium">{g.name}</p>
                  <p className="text-xs text-gray-500">
                    {g.funder}
                    {g.amount != null ? ` · £${g.amount.toLocaleString()}` : ""} · application due {fmt(g.applicationDeadline)}
                  </p>
                  {g.notes && <p className="mt-1 text-xs text-gray-500">{g.notes}</p>}
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLOR[g.status]}`}>
                  {STATUS_LABEL[g.status]}
                </span>
              </div>

              <div className="mt-3 border-t border-gray-100 pt-3">
                <p className="mb-2 text-xs font-medium text-gray-500">Reporting obligations</p>
                {g.reportingObligations.length > 0 && (
                  <ul className="mb-2 flex flex-col gap-1">
                    {g.reportingObligations.map((o) => {
                      const overdue = !o.completed && o.dueOn < now;
                      return (
                        <li key={o.id} className="flex items-center justify-between text-xs">
                          <span className={overdue ? "font-medium text-red-600" : "text-gray-700"}>
                            {o.description} — due {fmt(o.dueOn)}
                            {o.completed ? " (done)" : overdue ? " (overdue)" : ""}
                          </span>
                          {!o.completed && (
                            <ObligationCompleteButton orgId={orgId} grantId={g.id} obligationId={o.id} />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
                <ReportingObligationForm orgId={orgId} grantId={g.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
