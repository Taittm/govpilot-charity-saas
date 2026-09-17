import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMembership } from "@/lib/orgs";
import { getIcoRegistration } from "@/lib/data-protection";
import { canWrite } from "@/lib/permissions";
import { DataProtectionSubNav } from "@/components/DataProtectionSubNav";
import { IcoRegistrationForm } from "@/components/IcoRegistrationForm";

export default async function IcoRegistrationPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) notFound();

  const ico = await getIcoRegistration(orgId);

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-xl font-semibold">Data protection</h1>
      <p className="mb-6 text-sm text-gray-500">{membership.organisation.name}</p>
      <DataProtectionSubNav orgId={orgId} active="/ico" />

      {canWrite(membership.role) && (
        <IcoRegistrationForm
          orgId={orgId}
          initialTier={ico?.tier ?? "TIER_1"}
          initialRenewalOn={ico?.renewalOn ? ico.renewalOn.toISOString().slice(0, 10) : ""}
        />
      )}

      <p className="text-sm text-gray-600">
        This tier and renewal date drive the &quot;ICO data protection fee renewal&quot; item on the{" "}
        <a href={`/dashboard/${orgId}/calendar`} className="underline">
          compliance calendar
        </a>
        .
      </p>
    </div>
  );
}
