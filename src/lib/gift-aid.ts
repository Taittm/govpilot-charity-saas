import { taxYearLabelFor, taxYearBounds, recentTaxYearLabels } from "@/lib/tax-year";

export type DonationLike = {
  amount: number;
  scheme: "GIFT_AID" | "GASDS";
  donatedOn: Date;
};

export const GASDS_PER_DONATION_MAX = 30;
export const GASDS_ANNUAL_CAP = 8000;
export const GASDS_MATCH_MULTIPLE = 10;

export type TaxYearSummary = {
  taxYear: string;
  totalGiftAid: number;
  totalGasds: number;
  amountCap: number;
  matchCap: number;
  effectiveCap: number;
  amountCapExceeded: boolean;
  matchCapExceeded: boolean;
  historyEligible: boolean;
};

export function summarizeTaxYear(allDonations: DonationLike[], taxYearLabel: string): TaxYearSummary {
  const { start, end } = taxYearBounds(taxYearLabel);
  const inYear = allDonations.filter((d) => d.donatedOn >= start && d.donatedOn <= end);

  const totalGiftAid = inYear.filter((d) => d.scheme === "GIFT_AID").reduce((sum, d) => sum + d.amount, 0);
  const totalGasds = inYear.filter((d) => d.scheme === "GASDS").reduce((sum, d) => sum + d.amount, 0);

  const matchCap = totalGiftAid * GASDS_MATCH_MULTIPLE;
  const effectiveCap = Math.min(GASDS_ANNUAL_CAP, matchCap);

  return {
    taxYear: taxYearLabel,
    totalGiftAid,
    totalGasds,
    amountCap: GASDS_ANNUAL_CAP,
    matchCap,
    effectiveCap,
    amountCapExceeded: totalGasds > GASDS_ANNUAL_CAP,
    matchCapExceeded: totalGasds > matchCap,
    historyEligible: checkGiftAidHistoryEligibility(allDonations, taxYearLabel),
  };
}

// A charity can claim GASDS only if it has claimed Gift Aid in the current
// tax year, or in at least 2 of the previous 4 tax years.
export function checkGiftAidHistoryEligibility(allDonations: DonationLike[], taxYearLabel: string): boolean {
  const years = recentTaxYearLabels(taxYearBounds(taxYearLabel).start);
  const [current, ...prior] = years;

  const hasGiftAidIn = (label: string) => {
    const { start, end } = taxYearBounds(label);
    return allDonations.some((d) => d.scheme === "GIFT_AID" && d.donatedOn >= start && d.donatedOn <= end);
  };

  if (hasGiftAidIn(current)) return true;
  const priorYearsWithGiftAid = prior.filter(hasGiftAidIn).length;
  return priorYearsWithGiftAid >= 2;
}

export function isGasdsEligibleAmount(amount: number): boolean {
  return amount <= GASDS_PER_DONATION_MAX;
}

export { taxYearLabelFor };
