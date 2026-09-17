import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMembership } from "@/lib/orgs";
import { listMeetings } from "@/lib/governance";
import { getLatestDocumentInGroup } from "@/lib/documents";
import { canWrite } from "@/lib/permissions";
import { GovernanceSubNav } from "@/components/GovernanceSubNav";
import { MeetingForm } from "@/components/MeetingForm";
import { MinutesUpload } from "@/components/MinutesUpload";

const TYPE_LABEL: Record<string, string> = {
  BOARD_MEETING: "Board meeting",
  AGM: "AGM",
};

export default async function MeetingsPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) notFound();

  const meetings = await listMeetings(orgId);
  const minutes = await Promise.all(
    meetings.map((m) => (m.minutesGroupId ? getLatestDocumentInGroup(orgId, m.minutesGroupId) : null))
  );

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-xl font-semibold">Governance</h1>
      <p className="mb-6 text-sm text-gray-500">{membership.organisation.name}</p>
      <GovernanceSubNav orgId={orgId} active="/meetings" />

      {canWrite(membership.role) && <MeetingForm orgId={orgId} />}

      {meetings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          No meetings scheduled yet.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {meetings.map((m, i) => (
            <li key={m.id} className="rounded-md border border-gray-200 px-4 py-3">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{m.title}</p>
                  <p className="text-xs text-gray-500">
                    {TYPE_LABEL[m.type]} ·{" "}
                    {m.scheduledFor.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                {minutes[i] && (
                  <a
                    href={`/api/documents/${minutes[i]!.id}/download`}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50"
                  >
                    Download minutes (v{minutes[i]!.version})
                  </a>
                )}
              </div>
              {canWrite(membership.role) && <MinutesUpload orgId={orgId} meetingId={m.id} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
