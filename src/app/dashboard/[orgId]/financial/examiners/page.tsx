import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMembership } from "@/lib/orgs";
import { EXAMINER_DIRECTORY, REFERRAL_DIRECTORIES } from "@/lib/examiners";
import { FinancialSubNav } from "@/components/FinancialSubNav";

export default async function ExaminersPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-xl font-semibold">Financial</h1>
      <p className="mb-6 text-sm text-gray-500">{membership.organisation.name}</p>
      <FinancialSubNav orgId={orgId} active="/examiners" />

      <p className="mb-4 rounded-md bg-amber-50 p-3 text-xs text-amber-800">
        The listings below are placeholder examples for this prototype, not vetted or endorsed suppliers. For a
        real referral, use one of the professional body directories underneath.
      </p>

      <ul className="mb-8 flex flex-col gap-3">
        {EXAMINER_DIRECTORY.map((e) => (
          <li key={e.name} className="rounded-md border border-gray-200 px-4 py-3">
            <p className="text-sm font-medium">{e.name}</p>
            <p className="text-xs text-gray-500">
              {e.credential} · {e.region}
            </p>
            <p className="mt-1 text-sm text-gray-700">{e.handles}</p>
            <p className="text-xs text-gray-500">{e.contact}</p>
          </li>
        ))}
      </ul>

      <h2 className="mb-2 text-sm font-semibold">Find a real examiner or auditor</h2>
      <ul className="flex flex-col gap-1">
        {REFERRAL_DIRECTORIES.map((d) => (
          <li key={d.url}>
            <a href={d.url} target="_blank" rel="noreferrer" className="text-sm text-blue-700 underline">
              {d.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
