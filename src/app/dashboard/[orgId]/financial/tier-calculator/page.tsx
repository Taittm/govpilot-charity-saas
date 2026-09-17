import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMembership } from "@/lib/orgs";
import { listFinancialYearRecords } from "@/lib/financial";
import { calculateAccountsTier, ACCOUNTS_BASIS_LABEL, EXAMINATION_LABEL } from "@/lib/accounts-tier";
import { canWrite } from "@/lib/permissions";
import { FinancialSubNav } from "@/components/FinancialSubNav";
import { FinancialYearForm } from "@/components/FinancialYearForm";

function fmtGBP(n: number) {
  return `£${n.toLocaleString()}`;
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function TierCalculatorPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) notFound();

  const records = await listFinancialYearRecords(orgId);
  const defaultYearEndOn = membership.organisation.financialYearEnd.toISOString().slice(0, 10);

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-xl font-semibold">Financial</h1>
      <p className="mb-6 text-sm text-gray-500">{membership.organisation.name}</p>
      <FinancialSubNav orgId={orgId} active="/tier-calculator" />

      <p className="mb-4 text-sm text-gray-600">
        Enter income (and assets, if relevant to the audit threshold) for a financial year to see which accounts
        basis and level of external scrutiny applies. The 30 September 2026 threshold change is applied
        automatically based on the year end date entered.
      </p>

      {canWrite(membership.role) && <FinancialYearForm orgId={orgId} defaultYearEndOn={defaultYearEndOn} />}

      {records.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          No financial years entered yet.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {records.map((r) => {
            const tier = calculateAccountsTier(r.income, r.assets, r.yearEndOn);
            return (
              <li key={r.id} className="rounded-md border border-gray-200 px-4 py-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium">Year ended {fmtDate(r.yearEndOn)}</p>
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                    {tier.thresholdSet === "POST_30_SEP_2026" ? "Post 30 Sept 2026 thresholds" : "Pre 30 Sept 2026 thresholds"}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Income {fmtGBP(r.income)}
                  {r.assets != null ? ` · Assets ${fmtGBP(r.assets)}` : ""}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                    {ACCOUNTS_BASIS_LABEL[tier.basis]}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      tier.examination === "NONE" ? "bg-gray-100 text-gray-600" : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {EXAMINATION_LABEL[tier.examination]}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
