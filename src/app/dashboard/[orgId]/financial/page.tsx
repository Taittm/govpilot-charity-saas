import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMembership } from "@/lib/orgs";
import { listFinancialYearRecords, listDonations } from "@/lib/financial";
import { calculateAccountsTier, EXAMINATION_LABEL } from "@/lib/accounts-tier";
import { currentTaxYearLabel } from "@/lib/tax-year";
import { summarizeTaxYear } from "@/lib/gift-aid";
import { FinancialSubNav } from "@/components/FinancialSubNav";

export default async function FinancialPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) notFound();

  const [records, donations] = await Promise.all([listFinancialYearRecords(orgId), listDonations(orgId)]);

  const latest = records[0];
  const tier = latest ? calculateAccountsTier(latest.income, latest.assets, latest.yearEndOn) : null;

  const taxYear = currentTaxYearLabel();
  const summary = summarizeTaxYear(donations, taxYear);

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-xl font-semibold">Financial</h1>
      <p className="mb-6 text-sm text-gray-500">
        Accounts-tier calculator, examiner/auditor directory, and Gift Aid/GASDS tracking for{" "}
        {membership.organisation.name}.
      </p>
      <FinancialSubNav orgId={orgId} active="" />

      <div className="grid grid-cols-2 gap-3">
        <a
          href={`/dashboard/${orgId}/financial/tier-calculator`}
          className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
        >
          <p className="text-sm font-medium">Accounts tier</p>
          {tier ? (
            <>
              <p className="text-lg font-semibold">{EXAMINATION_LABEL[tier.examination]}</p>
              <p className="text-xs text-gray-500">
                Based on {latest.yearEndOn.toLocaleDateString("en-GB")} · £{latest.income.toLocaleString()} income
              </p>
            </>
          ) : (
            <p className="text-xs text-gray-500">No financial year recorded yet</p>
          )}
        </a>

        <a
          href={`/dashboard/${orgId}/financial/gift-aid`}
          className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
        >
          <p className="text-sm font-medium">Gift Aid & GASDS — {taxYear}</p>
          <p className="text-lg font-semibold">£{summary.totalGasds.toLocaleString()} GASDS claimed</p>
          <p className={`text-xs ${summary.amountCapExceeded || summary.matchCapExceeded ? "font-medium text-red-600" : "text-gray-500"}`}>
            {summary.amountCapExceeded || summary.matchCapExceeded
              ? "At risk of exceeding a cap"
              : `of £${summary.effectiveCap.toLocaleString()} available cap`}
          </p>
        </a>

        <a
          href={`/dashboard/${orgId}/financial/examiners`}
          className="col-span-2 rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
        >
          <p className="text-sm font-medium">Independent examiner / auditor directory</p>
          <p className="text-xs text-gray-500">Referral list to help find someone to examine or audit the accounts</p>
        </a>
      </div>
    </div>
  );
}
