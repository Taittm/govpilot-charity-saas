import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMembership } from "@/lib/orgs";
import { listDonations } from "@/lib/financial";
import { summarizeTaxYear, taxYearLabelFor } from "@/lib/gift-aid";
import { currentTaxYearLabel } from "@/lib/tax-year";
import { canWrite } from "@/lib/permissions";
import { FinancialSubNav } from "@/components/FinancialSubNav";
import { DonationForm } from "@/components/DonationForm";
import { TaxYearSelect } from "@/components/TaxYearSelect";

function fmtGBP(n: number) {
  return `£${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function GiftAidPage({
  params,
  searchParams,
}: {
  params: Promise<{ orgId: string }>;
  searchParams: Promise<{ taxYear?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { orgId } = await params;
  const { taxYear: taxYearParam } = await searchParams;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) notFound();

  const donations = await listDonations(orgId);

  const currentYear = currentTaxYearLabel();
  const allYears = Array.from(new Set([currentYear, ...donations.map((d) => taxYearLabelFor(d.donatedOn))])).sort(
    (a, b) => b.localeCompare(a)
  );
  const taxYear = taxYearParam && allYears.includes(taxYearParam) ? taxYearParam : currentYear;

  const summary = summarizeTaxYear(donations, taxYear);
  const yearDonations = donations
    .filter((d) => taxYearLabelFor(d.donatedOn) === taxYear)
    .sort((a, b) => b.donatedOn.getTime() - a.donatedOn.getTime());

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-xl font-semibold">Financial</h1>
      <p className="mb-6 text-sm text-gray-500">{membership.organisation.name}</p>
      <FinancialSubNav orgId={orgId} active="/gift-aid" />

      {canWrite(membership.role) && <DonationForm orgId={orgId} />}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Tax year summary</h2>
        <TaxYearSelect years={allYears} current={taxYear} />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-md border border-gray-200 p-3">
          <p className="text-xs text-gray-500">Gift Aid donations ({taxYear})</p>
          <p className="text-lg font-semibold">{fmtGBP(summary.totalGiftAid)}</p>
        </div>
        <div className="rounded-md border border-gray-200 p-3">
          <p className="text-xs text-gray-500">GASDS donations ({taxYear})</p>
          <p className="text-lg font-semibold">{fmtGBP(summary.totalGasds)}</p>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-2">
        {!summary.historyEligible && (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            Not GASDS-eligible: no Gift Aid claimed this tax year, and fewer than 2 of the last 4 tax years have a
            Gift Aid claim on record.
          </p>
        )}
        {summary.amountCapExceeded && (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            GASDS claimed ({fmtGBP(summary.totalGasds)}) exceeds the £{summary.amountCap.toLocaleString()}/year cap.
          </p>
        )}
        {!summary.amountCapExceeded && summary.matchCapExceeded && (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            GASDS claimed ({fmtGBP(summary.totalGasds)}) exceeds 10× matched Gift Aid ({fmtGBP(summary.matchCap)}).
          </p>
        )}
        {!summary.amountCapExceeded && !summary.matchCapExceeded && summary.historyEligible && (
          <p className="rounded-md bg-green-50 p-3 text-sm text-green-700">
            GASDS claim is within both caps — up to {fmtGBP(summary.effectiveCap)} available this tax year.
          </p>
        )}
      </div>

      {yearDonations.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          No donations logged for {taxYear} yet.
        </div>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-400">
              <th className="py-2">Donor</th>
              <th className="py-2">Scheme</th>
              <th className="py-2">Method</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {yearDonations.map((d) => (
              <tr key={d.id} className="border-b border-gray-100">
                <td className="py-2">{d.donorName ?? "—"}</td>
                <td className="py-2">{d.scheme === "GIFT_AID" ? "Gift Aid" : "GASDS"}</td>
                <td className="py-2">{d.method.charAt(0) + d.method.slice(1).toLowerCase()}</td>
                <td className="py-2">{fmtGBP(d.amount)}</td>
                <td className="py-2">
                  {d.donatedOn.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
