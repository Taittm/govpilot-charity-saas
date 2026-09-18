import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMembership } from "@/lib/orgs";
import { canManageMembers } from "@/lib/permissions";
import {
  IconBriefcase,
  IconCalculator,
  IconCalendar,
  IconClipboard,
  IconGrant,
  IconLock,
  IconShield,
  IconUsers,
} from "@/components/marketing/icons";

const incomeBandLabels: Record<string, string> = {
  UNDER_10K: "Under £10,000",
  BETWEEN_10K_25K: "£10,000 – £25,000",
  OVER_25K: "£25,000 – £250,000",
  OVER_250K: "£250,000 – £1,000,000",
  OVER_1M: "Over £1,000,000",
};

const MODULES = [
  {
    icon: IconClipboard,
    label: "Health Check",
    href: "health-check",
    description: "Run a red/amber/green compliance score and export a PDF compliance kit.",
  },
  {
    icon: IconCalendar,
    label: "Compliance Calendar",
    href: "calendar",
    description: "Every upcoming filing, fee renewal, and DBS expiry in one place.",
  },
  {
    icon: IconBriefcase,
    label: "Documents",
    href: "documents",
    description: "Governing documents, past filings, and policies in one vault.",
  },
  {
    icon: IconShield,
    label: "Governance",
    href: "governance",
    description: "Trustee register, DBS tracking, meetings, conflicts, and policy reviews.",
  },
  {
    icon: IconCalculator,
    label: "Financial",
    href: "financial",
    description: "Accounts-tier calculator, examiner directory, and Gift Aid/GASDS tracking.",
  },
  {
    icon: IconLock,
    label: "Data Protection",
    href: "data-protection",
    description: "ICO fee tracking, templates, breach log, and subject access requests.",
  },
  {
    icon: IconGrant,
    label: "Grants",
    href: "grants",
    description: "Track funding applications, awards, and reporting obligations.",
  },
];

export default async function OrgDashboardPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { orgId } = await params;
  const membership = await getMembership(session.user.id, orgId);
  if (!membership) notFound();

  const { organisation } = membership;
  const modules = canManageMembers(membership.role)
    ? [
        ...MODULES,
        {
          icon: IconUsers,
          label: "Members",
          href: "members",
          description: "Invite trustees or staff and manage their access.",
        },
      ]
    : MODULES;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold tracking-tight text-slate-900">{organisation.name}</h1>
      <p className="mb-8 text-sm text-slate-500">
        {organisation.type} · {incomeBandLabels[organisation.incomeBand]} · year end{" "}
        {new Date(organisation.financialYearEnd).toLocaleDateString("en-GB")}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map(({ icon: Icon, label, href, description }) => (
          <a
            key={href}
            href={`/dashboard/${orgId}/${href}`}
            className="rounded-xl border border-slate-200 p-5 transition hover:border-blue-200 hover:shadow-md hover:shadow-blue-100/50"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-sm font-semibold text-slate-900">{label}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
