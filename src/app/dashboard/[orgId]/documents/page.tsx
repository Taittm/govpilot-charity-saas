import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMembership } from "@/lib/orgs";
import { listDocumentGroups, DOCUMENT_TAG_LABELS } from "@/lib/documents";
import { canWrite } from "@/lib/permissions";
import { DocumentUploadForm } from "@/components/DocumentUploadForm";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) notFound();

  const groups = await listDocumentGroups(orgId);
  const existingGroups = groups.map((g) => ({
    groupId: g.latest.groupId,
    label: `${g.latest.filename} (v${g.latest.version})`,
  }));

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-xl font-semibold">Document vault</h1>
      <p className="mb-6 text-sm text-gray-500">
        Governing documents, past filings, and policies for {membership.organisation.name}.
      </p>

      {canWrite(membership.role) && <DocumentUploadForm orgId={orgId} existingGroups={existingGroups} />}

      {groups.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          No documents uploaded yet.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {groups.map(({ latest, versions }) => (
            <li key={latest.groupId} className="rounded-md border border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{latest.filename}</p>
                  <p className="text-xs text-gray-500">
                    {DOCUMENT_TAG_LABELS[latest.tag]} · {formatSize(latest.sizeBytes)} · v{latest.version} · uploaded by{" "}
                    {latest.uploadedBy.name ?? latest.uploadedBy.email} on{" "}
                    {latest.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <a
                  href={`/api/documents/${latest.id}/download`}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  Download
                </a>
              </div>

              {versions.length > 1 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-gray-500">
                    {versions.length - 1} earlier version{versions.length - 1 === 1 ? "" : "s"}
                  </summary>
                  <ul className="mt-2 flex flex-col gap-1 border-l border-gray-100 pl-3">
                    {versions.slice(1).map((v) => (
                      <li key={v.id} className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          v{v.version} ·{" "}
                          {v.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <a href={`/api/documents/${v.id}/download`} className="underline hover:text-gray-700">
                          Download
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
