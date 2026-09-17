import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMembership } from "@/lib/orgs";
import { listSubjectAccessRequests } from "@/lib/data-protection";
import { canWrite } from "@/lib/permissions";
import { DataProtectionSubNav } from "@/components/DataProtectionSubNav";
import { SarForm } from "@/components/SarForm";
import { SarCompleteButton } from "@/components/SarCompleteButton";

function fmt(date: Date) {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function SarsPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) notFound();

  const sars = await listSubjectAccessRequests(orgId);
  const now = new Date();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-xl font-semibold">Data protection</h1>
      <p className="mb-6 text-sm text-gray-500">{membership.organisation.name}</p>
      <DataProtectionSubNav orgId={orgId} active="/sars" />

      {canWrite(membership.role) && <SarForm orgId={orgId} />}

      {sars.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          No subject access requests logged.
        </div>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-400">
              <th className="py-2">Requester</th>
              <th className="py-2">Received</th>
              <th className="py-2">Due (statutory 1 month)</th>
              <th className="py-2">Status</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {sars.map((s) => {
              const overdue = s.status === "OPEN" && s.dueOn < now;
              return (
                <tr key={s.id} className="border-b border-gray-100">
                  <td className="py-2 font-medium">{s.requesterName ?? "—"}</td>
                  <td className="py-2">{fmt(s.receivedOn)}</td>
                  <td className={`py-2 ${overdue ? "font-medium text-red-600" : ""}`}>{fmt(s.dueOn)}</td>
                  <td className="py-2">
                    {s.status === "COMPLETED" ? (
                      <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                        Completed
                      </span>
                    ) : overdue ? (
                      <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                        Overdue
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                        Open
                      </span>
                    )}
                  </td>
                  <td className="py-2">
                    {s.status === "OPEN" && canWrite(membership.role) && (
                      <SarCompleteButton orgId={orgId} sarId={s.id} />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
