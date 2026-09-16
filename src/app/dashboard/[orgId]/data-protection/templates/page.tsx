import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMembership } from "@/lib/orgs";
import { findLatestDocumentByFilename } from "@/lib/documents";
import { privacyNoticeTemplate, dataRetentionPolicyTemplate } from "@/lib/data-protection-templates";
import { DataProtectionSubNav } from "@/components/DataProtectionSubNav";
import { TemplateEditor } from "@/components/TemplateEditor";

const PRIVACY_FILENAME = "Privacy Notice.txt";
const RETENTION_FILENAME = "Data Retention Policy.txt";

export default async function TemplatesPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) notFound();

  const [existingPrivacy, existingRetention] = await Promise.all([
    findLatestDocumentByFilename(orgId, PRIVACY_FILENAME),
    findLatestDocumentByFilename(orgId, RETENTION_FILENAME),
  ]);

  const privacyText = existingPrivacy
    ? Buffer.from(existingPrivacy.content).toString("utf-8")
    : privacyNoticeTemplate(membership.organisation.name);
  const retentionText = existingRetention
    ? Buffer.from(existingRetention.content).toString("utf-8")
    : dataRetentionPolicyTemplate(membership.organisation.name);

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-xl font-semibold">Data protection</h1>
      <p className="mb-6 text-sm text-gray-500">{membership.organisation.name}</p>
      <DataProtectionSubNav orgId={orgId} active="/templates" />

      <p className="mb-4 text-sm text-gray-600">
        Generic starting-point templates, not legal advice — edit for {membership.organisation.name} and save.
        Saving creates a new version in the{" "}
        <a href={`/dashboard/${orgId}/documents`} className="underline">
          document vault
        </a>{" "}
        (tag: Policy).
      </p>

      <TemplateEditor
        orgId={orgId}
        filename={PRIVACY_FILENAME}
        label="Privacy notice"
        initialText={privacyText}
        groupId={existingPrivacy?.groupId ?? null}
      />

      <TemplateEditor
        orgId={orgId}
        filename={RETENTION_FILENAME}
        label="Data retention policy"
        initialText={retentionText}
        groupId={existingRetention?.groupId ?? null}
      />
    </div>
  );
}
