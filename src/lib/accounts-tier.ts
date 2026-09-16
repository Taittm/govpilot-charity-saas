export type ThresholdSet = "PRE_30_SEP_2026" | "POST_30_SEP_2026";
export type AccountsBasis = "RECEIPTS_AND_PAYMENTS" | "ACCRUALS";
export type ExaminationRequirement =
  | "NONE"
  | "INDEPENDENT_EXAMINATION"
  | "PROFESSIONALLY_QUALIFIED_EXAMINER"
  | "STATUTORY_AUDIT";

const TRANSITION_DATE = new Date("2026-09-30T00:00:00Z");

type Thresholds = {
  receiptsPaymentsMax: number;
  examinationMin: number;
  qualifiedExaminerMin: number | null;
  auditIncomeMin: number;
  auditAssetsMin: number;
};

// Both threshold sets are live simultaneously during the transition — which
// one applies is keyed by the financial year in question (its year end
// date), not by today's date. See the regulatory cheat sheet in CLAUDE.md.
const PRE_TRANSITION: Thresholds = {
  receiptsPaymentsMax: 250_000,
  examinationMin: 25_000,
  qualifiedExaminerMin: null, // not a distinct tier under the pre-transition rules as given
  auditIncomeMin: 1_000_000,
  auditAssetsMin: 3_260_000,
};

const POST_TRANSITION: Thresholds = {
  receiptsPaymentsMax: 500_000,
  examinationMin: 40_000,
  qualifiedExaminerMin: 500_000,
  auditIncomeMin: 1_500_000,
  auditAssetsMin: 5_000_000,
};

export type AccountsTierResult = {
  thresholdSet: ThresholdSet;
  thresholds: Thresholds;
  basis: AccountsBasis;
  examination: ExaminationRequirement;
};

export function calculateAccountsTier(income: number, assets: number | null, yearEndOn: Date): AccountsTierResult {
  const isPostTransition = yearEndOn >= TRANSITION_DATE;
  const thresholds = isPostTransition ? POST_TRANSITION : PRE_TRANSITION;

  const basis: AccountsBasis = income <= thresholds.receiptsPaymentsMax ? "RECEIPTS_AND_PAYMENTS" : "ACCRUALS";

  let examination: ExaminationRequirement = "NONE";
  if (income > thresholds.examinationMin) examination = "INDEPENDENT_EXAMINATION";
  if (thresholds.qualifiedExaminerMin !== null && income > thresholds.qualifiedExaminerMin) {
    examination = "PROFESSIONALLY_QUALIFIED_EXAMINER";
  }
  const auditRequired = income > thresholds.auditIncomeMin || (assets !== null && assets > thresholds.auditAssetsMin);
  if (auditRequired) examination = "STATUTORY_AUDIT";

  return {
    thresholdSet: isPostTransition ? "POST_30_SEP_2026" : "PRE_30_SEP_2026",
    thresholds,
    basis,
    examination,
  };
}

export const ACCOUNTS_BASIS_LABEL: Record<AccountsBasis, string> = {
  RECEIPTS_AND_PAYMENTS: "Receipts and payments accounts",
  ACCRUALS: "Accruals accounts",
};

export const EXAMINATION_LABEL: Record<ExaminationRequirement, string> = {
  NONE: "No formal external scrutiny required",
  INDEPENDENT_EXAMINATION: "Independent examination required",
  PROFESSIONALLY_QUALIFIED_EXAMINER: "Professionally-qualified examiner required",
  STATUTORY_AUDIT: "Statutory audit required",
};
