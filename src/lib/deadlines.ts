import type { Organisation, OrganisationType, Trustee, Policy, IcoTier, Grant, GrantReportingObligation } from "@prisma/client";
import { startOfDay, addMonths, addDays, DAY_MS } from "@/lib/date-utils";
import { ICO_FEE_LABEL } from "@/lib/ico";

export type DeadlineType =
  | "CHARITY_ANNUAL_RETURN"
  | "CIC34_CONFIRMATION_STATEMENT"
  | "ICO_FEE_RENEWAL"
  | "DBS_EXPIRY"
  | "POLICY_REVIEW"
  | "GRANT_APPLICATION"
  | "GRANT_REPORTING";

export type Urgency = "OVERDUE" | "DUE_7" | "DUE_30" | "DUE_60" | "LATER";

export type Deadline = {
  type: DeadlineType;
  label: string;
  detail: string;
  dueDate: Date;
  daysUntil: number;
  urgency: Urgency;
};

/**
 * Finds the next occurrence of `dueOffsetFrom(anchor)` that falls on or after
 * `reference`, by walking the recurring month/day of `anchorSeed` forward one
 * year at a time. This is how a single stored date (e.g. financialYearEnd,
 * which is Postgres/SQLite DateTime with a specific year attached) becomes a
 * recurring annual deadline: only the month/day of the seed is used as the
 * recurrence pattern, so the calendar always shows the next upcoming
 * instance regardless of which year happens to be stored.
 */
function nextOccurrence(
  anchorSeed: Date,
  reference: Date,
  dueOffsetFrom: (anchor: Date) => Date
): Date {
  const anchor = new Date(anchorSeed);
  // Start from the most recent anchor occurrence that isn't more than a
  // year in the future, then walk forward until the resulting due date is
  // on or after the reference date.
  anchor.setFullYear(reference.getFullYear() - 1);
  let due = dueOffsetFrom(anchor);
  while (due < reference) {
    anchor.setFullYear(anchor.getFullYear() + 1);
    due = dueOffsetFrom(anchor);
  }
  return due;
}

function urgencyFor(daysUntil: number): Urgency {
  if (daysUntil < 0) return "OVERDUE";
  if (daysUntil <= 7) return "DUE_7";
  if (daysUntil <= 30) return "DUE_30";
  if (daysUntil <= 60) return "DUE_60";
  return "LATER";
}

function toDeadline(type: DeadlineType, label: string, detail: string, dueDate: Date, reference: Date): Deadline {
  const daysUntil = Math.round((startOfDay(dueDate).getTime() - startOfDay(reference).getTime()) / DAY_MS);
  return { type, label, detail, dueDate, daysUntil, urgency: urgencyFor(daysUntil) };
}

function appliesToCharity(type: OrganisationType) {
  return type === "CHARITY" || type === "BOTH";
}

function appliesToCic(type: OrganisationType) {
  return type === "CIC" || type === "BOTH";
}

/**
 * Deadlines are computed on the fly from the organisation's stored fields
 * rather than persisted — there is no separate Deadline table to regenerate,
 * so the calendar is always current the moment an organisation's type,
 * income band, or financial year end changes, with nothing to keep in sync.
 *
 * financialYearEnd anchors the Charity Commission annual return. CIC34 /
 * confirmation statement and ICO fee renewal are genuinely anchored to
 * incorporation/registration anniversaries in the real world, which this
 * data model doesn't capture yet — as a placeholder we anchor them to the
 * organisation's record creation date (`createdAt`) instead. Revisit if a
 * real incorporation/registration date field is added.
 */
export function getDeadlines(
  organisation: Organisation,
  reference: Date = new Date(),
  icoOverride?: { tier: IcoTier; renewalOn: Date | null }
): Deadline[] {
  const deadlines: Deadline[] = [];

  if (appliesToCharity(organisation.type)) {
    const dueDate = nextOccurrence(organisation.financialYearEnd, reference, (anchor) => addMonths(anchor, 10));
    deadlines.push(
      toDeadline(
        "CHARITY_ANNUAL_RETURN",
        "Charity Commission annual return",
        "Due within 10 months of the financial year end.",
        dueDate,
        reference
      )
    );
  }

  if (appliesToCic(organisation.type)) {
    const dueDate = nextOccurrence(organisation.createdAt, reference, (anchor) => addDays(anchor, 14));
    deadlines.push(
      toDeadline(
        "CIC34_CONFIRMATION_STATEMENT",
        "CIC34 report + confirmation statement",
        "Confirmation statement due 14 days after the review period anniversary; CIC34 filed alongside it.",
        dueDate,
        reference
      )
    );
  }

  const icoTier = icoOverride?.tier ?? "TIER_1";
  const icoAnchor = icoOverride?.renewalOn ?? organisation.createdAt;
  const icoDue = nextOccurrence(icoAnchor, reference, (anchor) => anchor);
  deadlines.push(
    toDeadline(
      "ICO_FEE_RENEWAL",
      "ICO data protection fee renewal",
      icoOverride ? ICO_FEE_LABEL[icoTier] : `${ICO_FEE_LABEL[icoTier]} (default — confirm tier in Data Protection).`,
      icoDue,
      reference
    )
  );

  return deadlines.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}

/**
 * DBS expiry and policy review deadlines come from records the user enters
 * directly (Trustee.dbsExpiresOn, Policy.reviewDueOn) rather than a
 * computed recurrence rule, so — unlike getDeadlines — this takes the
 * already-fetched records as plain arrays and stays a pure function; the
 * Prisma queries live in src/lib/governance.ts.
 */
export function getGovernanceDeadlines(
  trustees: Pick<Trustee, "id" | "name" | "dbsCheckType" | "dbsExpiresOn">[],
  policies: Pick<Policy, "id" | "name" | "reviewDueOn">[],
  reference: Date = new Date()
): Deadline[] {
  const dbsDeadlines = trustees
    .filter((t): t is typeof t & { dbsExpiresOn: Date } => t.dbsExpiresOn !== null)
    .map((t) =>
      toDeadline(
        "DBS_EXPIRY",
        `DBS check expiring — ${t.name}`,
        `${t.dbsCheckType.charAt(0)}${t.dbsCheckType.slice(1).toLowerCase()} check`,
        t.dbsExpiresOn,
        reference
      )
    );

  const policyDeadlines = policies.map((p) =>
    toDeadline("POLICY_REVIEW", `Policy review due — ${p.name}`, "Policy review date", p.reviewDueOn, reference)
  );

  return [...dbsDeadlines, ...policyDeadlines].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}

/**
 * Grant application deadlines (while still undecided) and open reporting
 * obligations, same shape/rationale as getGovernanceDeadlines: pure
 * function over already-fetched records, Prisma queries live in
 * src/lib/governance.ts.
 */
export function getGrantDeadlines(
  grants: (Pick<Grant, "id" | "name" | "funder" | "applicationDeadline" | "status"> & {
    reportingObligations: Pick<GrantReportingObligation, "id" | "description" | "dueOn" | "completed">[];
  })[],
  reference: Date = new Date()
): Deadline[] {
  const applicationDeadlines = grants
    .filter((g) => g.status === "RESEARCHING" || g.status === "APPLIED")
    .map((g) =>
      toDeadline(
        "GRANT_APPLICATION",
        `Grant application due — ${g.name}`,
        `Funder: ${g.funder}`,
        g.applicationDeadline,
        reference
      )
    );

  const reportingDeadlines = grants.flatMap((g) =>
    g.reportingObligations
      .filter((o) => !o.completed)
      .map((o) =>
        toDeadline("GRANT_REPORTING", `Grant reporting due — ${g.name}`, o.description, o.dueOn, reference)
      )
  );

  return [...applicationDeadlines, ...reportingDeadlines].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}

export const URGENCY_LABEL: Record<Urgency, string> = {
  OVERDUE: "Overdue",
  DUE_7: "Due within 7 days",
  DUE_30: "Due within 30 days",
  DUE_60: "Due within 60 days",
  LATER: "Later",
};

export const URGENCY_COLOR: Record<Urgency, { bg: string; text: string }> = {
  OVERDUE: { bg: "bg-red-50", text: "text-red-700" },
  DUE_7: { bg: "bg-red-50", text: "text-red-700" },
  DUE_30: { bg: "bg-amber-50", text: "text-amber-700" },
  DUE_60: { bg: "bg-amber-50", text: "text-amber-700" },
  LATER: { bg: "bg-gray-50", text: "text-gray-600" },
};
