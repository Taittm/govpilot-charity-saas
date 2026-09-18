import Link from "next/link";
import { BackToTop } from "./BackToTop";
import {
  IconArrowRight,
  IconBriefcase,
  IconCalculator,
  IconCalendar,
  IconCheck,
  IconClipboard,
  IconGrant,
  IconLock,
  IconShield,
  IconUsers,
} from "./icons";

const FEATURES = [
  {
    icon: IconClipboard,
    title: "Compliance health check",
    description:
      "A red/amber/green questionnaire scores where an organisation stands right now, with versioned history and a one-click PDF compliance kit.",
  },
  {
    icon: IconCalendar,
    title: "Compliance calendar & document vault",
    description:
      "Charity Commission, CIC34 and ICO deadlines calculated automatically, with reminders and a single place to store the evidence.",
  },
  {
    icon: IconShield,
    title: "Governance",
    description:
      "Trustee/director register with DBS expiry tracking, meetings and minutes, conflicts of interest, and policy review dates — all feeding the calendar.",
  },
  {
    icon: IconCalculator,
    title: "Financial compliance",
    description:
      "An accounts-tier calculator that already knows the pre- and post-30 September 2026 thresholds, an examiner directory, and a Gift Aid/GASDS tracker.",
  },
  {
    icon: IconLock,
    title: "Data protection",
    description:
      "ICO fee tracking by tier, ready-to-use privacy and retention templates, a breach log, and a subject access request tracker with statutory due dates.",
  },
  {
    icon: IconGrant,
    title: "Grants tracker",
    description:
      "Keep funding applications, awards and reporting obligations in one pipeline instead of scattered emails and spreadsheets.",
  },
  {
    icon: IconUsers,
    title: "Team access & permissions",
    description:
      "Invite trustees, staff or volunteers by link with the right role from day one — read/write for those who run things, read-only for those who need visibility.",
  },
  {
    icon: IconBriefcase,
    title: "Multi-client consultant console",
    description:
      "One login, every client organisation. See status across a whole portfolio instead of juggling separate spreadsheets per charity.",
  },
];

const REGULATORY_FACTS = [
  {
    label: "Charity Commission",
    fact: "Reporting tiers shift on 30 September 2026 — independent examination kicks in above £40k income, up from £25k.",
  },
  {
    label: "Companies House",
    fact: "CICs file a CIC34 report every year alongside the standard confirmation statement, on a 12-month cycle.",
  },
  {
    label: "ICO",
    fact: "Most charities pay the Tier 1 data protection fee (£52/year) regardless of size, unless they qualify for an exemption.",
  },
  {
    label: "HMRC",
    fact: "Gift Aid Small Donations top-up is capped at £8,000 of qualifying donations a year, and at 10× a charity's matched Gift Aid claim.",
  },
];

const FAQS = [
  {
    q: "Does Compliance Hub give legal or financial advice?",
    a: "No. It tracks deadlines, stores evidence and scores your position against known rules, but it isn't a substitute for professional advice. Always confirm requirements directly with the Charity Commission, Companies House, ICO, HMRC or your accountant/examiner.",
  },
  {
    q: "Do you carry out DBS checks?",
    a: "No — DBS checks always go through an authorised umbrella body. Compliance Hub only tracks the check type, date and expiry so renewals don't get missed.",
  },
  {
    q: "Can I give my trustees or team members their own login?",
    a: "Yes. An admin can invite people by link and choose their role — full read/write access for trustees and staff, or read-only for anyone who just needs visibility.",
  },
  {
    q: "We're a consultancy managing several charities — does this work for us?",
    a: "That's the core use case. One console shows every client organisation's status, with each client's team able to log in to just their own organisation.",
  },
  {
    q: "What happens after the thresholds change in September 2026?",
    a: "Both the old and new Charity Commission reporting tiers are supported at once, keyed to each organisation's financial year, so nothing needs to be manually swapped over on the day.",
  },
];

export function MarketingHome() {
  return (
    <div className="bg-white text-slate-900">
      <SiteHeader />
      <Hero />
      <RegulatorStrip />
      <ProblemSection />
      <HowItWorks />
      <FeatureGrid />
      <WhoItsFor />
      <RegulatoryFacts />
      <Pricing />
      <Faq />
      <FinalCta />
      <SiteFooter />
      <BackToTop />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            CH
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            Compliance Hub
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#product" className="hover:text-blue-700">Product</a>
          <a href="#who-its-for" className="hover:text-blue-700">Who it&apos;s for</a>
          <a href="#pricing" className="hover:text-blue-700">Pricing</a>
          <a href="#faq" className="hover:text-blue-700">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-slate-600 hover:text-blue-700 sm:inline"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
          >
            Get started free
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 flex justify-center"
      >
        <div className="h-[420px] w-[780px] rounded-full bg-blue-100/70 blur-3xl" />
      </div>
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-16 md:grid-cols-2 md:pb-28 md:pt-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
            Built for UK charities &amp; CICs
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Every compliance deadline.
            <span className="text-blue-600"> One calendar.</span> Zero surprises.
          </h1>
          <p className="mt-5 text-lg text-slate-600">
            Compliance Hub brings Charity Commission filings, Companies House,
            ICO fees, Gift Aid, DBS renewals and more into a single system — so
            trustees stop guessing and consultants stop rebuilding the same
            spreadsheet for every client.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700"
            >
              Get started free
              <IconArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#product"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
            >
              See what&apos;s included
            </a>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            No credit card required. Set up your first organisation in minutes.
          </p>
        </div>
        <HeroMockup />
      </div>
    </section>
  );
}

function HeroMockup() {
  return (
    <div className="relative">
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/60">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Health check
            </p>
            <p className="text-sm font-semibold text-slate-900">Riverside Youth Trust</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            82% compliant
          </span>
        </div>
        <ul className="mt-4 space-y-3 text-sm">
          <li className="flex items-center justify-between rounded-lg bg-emerald-50/70 px-3 py-2">
            <span className="text-slate-700">Trustee DBS checks up to date</span>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </li>
          <li className="flex items-center justify-between rounded-lg bg-amber-50/70 px-3 py-2">
            <span className="text-slate-700">ICO fee renews in 12 days</span>
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          </li>
          <li className="flex items-center justify-between rounded-lg bg-red-50/70 px-3 py-2">
            <span className="text-slate-700">Annual return due in 6 days</span>
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          </li>
        </ul>
        <div className="mt-5 rounded-lg border border-dashed border-slate-200 px-3 py-3 text-xs text-slate-400">
          Illustrative preview — your organisation&apos;s own deadlines appear
          automatically once it&apos;s set up.
        </div>
      </div>
      <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-lg shadow-slate-200/60 sm:block">
        <p className="text-xs font-medium text-slate-400">Managed by one consultant</p>
        <p className="text-sm font-semibold text-slate-900">12 client organisations</p>
      </div>
    </div>
  );
}

function RegulatorStrip() {
  const regulators = [
    "Charity Commission",
    "Companies House",
    "ICO",
    "HMRC",
    "DBS",
  ];
  return (
    <section className="border-y border-slate-100 bg-slate-50/60 py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Tracks every regulator that matters
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {regulators.map((name) => (
            <span key={name} className="text-sm font-semibold text-slate-500">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const problems = [
    "Deadlines tracked in someone's head, or across three different spreadsheets.",
    "A trustee's DBS check quietly expires and nobody notices until it's a problem.",
    "The ICO fee renewal is a surprise every single year.",
    "Consultants re-explain the same rules to every client, from scratch, every quarter.",
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Compliance shouldn&apos;t feel like a second job
        </h2>
        <p className="mt-4 text-slate-600">
          Small charities and CICs run on volunteer time and trust — but the
          paperwork doesn&apos;t get smaller because the team is. Sound familiar?
        </p>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {problems.map((problem) => (
          <div
            key={problem}
            className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-5"
          >
            <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
              !
            </span>
            <p className="text-sm text-slate-700">{problem}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const pillars = [
    {
      title: "One calendar, every regulator",
      description:
        "Charity Commission, CIC34 and ICO deadlines are calculated automatically from each organisation's own financial year and registration — not a generic reminder list.",
    },
    {
      title: "A score you can act on",
      description:
        "The red/amber/green health check turns 'are we compliant?' into a specific, versioned answer, exportable as a PDF compliance kit for trustees or funders.",
    },
    {
      title: "Built for consultants and charities alike",
      description:
        "Run a whole client portfolio from one console, or manage a single organisation with your own team invited in at the right permission level.",
    },
  ];
  return (
    <section id="product" className="bg-blue-600 py-20 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">How Compliance Hub helps</h2>
          <p className="mt-4 text-blue-100">
            It replaces the manual health check a consultant would normally run by
            hand — and keeps working long after that one-off engagement ends.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <div key={pillar.title} className="rounded-2xl bg-blue-700/40 p-6 ring-1 ring-white/10">
              <span className="text-sm font-bold text-blue-200">0{i + 1}</span>
              <h3 className="mt-3 text-lg font-semibold">{pillar.title}</h3>
              <p className="mt-2 text-sm text-blue-100">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Everything in one place
        </h2>
        <p className="mt-4 text-slate-600">
          Eight modules, one login. No more piecing compliance together across
          separate tools.
        </p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-100 p-6 transition hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhoItsFor() {
  return (
    <section id="who-its-for" className="bg-slate-50/60 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Two ways to use it
          </h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
            <IconBriefcase className="h-8 w-8 text-blue-600" />
            <h3 className="mt-4 text-xl font-semibold text-slate-900">
              Consultants &amp; agencies
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Manage every client organisation from one console instead of a
              spreadsheet per client.
            </p>
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              {[
                "Portfolio-wide view of every client's compliance status",
                "Run a health check and export a branded compliance kit in minutes",
                "Invite each client's own team into just their organisation",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <IconCheck className="mt-0.5 h-4 w-4 flex-none text-blue-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
            <IconUsers className="h-8 w-8 text-blue-600" />
            <h3 className="mt-4 text-xl font-semibold text-slate-900">
              Charities &amp; CICs
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Run your own compliance in-house, without hiring a consultant for
              every routine check.
            </p>
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              {[
                "See exactly where you stand with a plain-English health check",
                "Never miss a filing, fee renewal or DBS expiry again",
                "Bring trustees and staff in with the right level of access",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <IconCheck className="mt-0.5 h-4 w-4 flex-none text-blue-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function RegulatoryFacts() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          We track the rules so you don&apos;t have to
        </h2>
        <p className="mt-4 text-slate-600">
          The regulatory landscape keeps moving — Compliance Hub is built to
          move with it.
        </p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {REGULATORY_FACTS.map(({ label, fact }) => (
          <div key={label} className="rounded-xl border border-slate-100 p-5">
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              {label}
            </span>
            <p className="mt-2 text-sm text-slate-700">{fact}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-slate-400">
        Figures shown are current as of late 2026 and subject to change —
        always confirm against gov.uk before relying on them.
      </p>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="bg-slate-50/60 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-slate-600">
            Priced well below what a single manual health check costs — because
            it replaces the spreadsheet, not the relationship.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-lg font-semibold text-slate-900">Charity or CIC</h3>
            <p className="mt-1 text-sm text-slate-500">For a single organisation</p>
            <p className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-slate-900">£19</span>
              <span className="text-sm text-slate-500">/month</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">
              or £190/year — two months free
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              {[
                "All eight modules included",
                "Unlimited trustees and staff invited",
                "Unlimited health checks and PDF exports",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <IconCheck className="mt-0.5 h-4 w-4 flex-none text-blue-600" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="mt-8 block rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Get started free
            </Link>
          </div>
          <div className="rounded-2xl bg-slate-900 p-8 text-white shadow-sm">
            <h3 className="text-lg font-semibold">Consultant / agency</h3>
            <p className="mt-1 text-sm text-slate-300">Manage every client from one console</p>
            <p className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold">£15</span>
              <span className="text-sm text-slate-300">/client/month</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">
              tapering to £9/client/month at 25+ clients — no base platform fee
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-200">
              {[
                "Portfolio-wide compliance dashboard",
                "Every client gets their own organisation and invited team",
                "Volume pricing kicks in automatically at 10 and 25 clients",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <IconCheck className="mt-0.5 h-4 w-4 flex-none text-blue-400" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="mt-8 block rounded-lg bg-white px-4 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-blue-50"
            >
              Set up your console
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-4xl px-6 py-20">
      <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
        Frequently asked questions
      </h2>
      <div className="mt-12 divide-y divide-slate-100 rounded-2xl border border-slate-100">
        {FAQS.map(({ q, a }) => (
          <details key={q} className="group p-6 open:bg-slate-50/60">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-900">
              {q}
              <span className="text-blue-600 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 px-8 py-16 text-center text-white sm:px-16">
        <h2 className="text-3xl font-bold tracking-tight">
          Ready to stop chasing deadlines?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-blue-100">
          Set up your first organisation in minutes and see exactly where you
          stand.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Get started free
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Log in
          </Link>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <span className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                CH
              </span>
              <span className="text-lg font-semibold text-slate-900">
                Compliance Hub
              </span>
            </span>
            <p className="mt-3 text-sm text-slate-500">
              Compliance tracking built for UK charities, CICs and the
              consultants who support them.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div>
              <p className="font-semibold text-slate-900">Product</p>
              <ul className="mt-3 space-y-2 text-slate-500">
                <li><a href="#product" className="hover:text-blue-700">How it works</a></li>
                <li><a href="#pricing" className="hover:text-blue-700">Pricing</a></li>
                <li><a href="#faq" className="hover:text-blue-700">FAQ</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Account</p>
              <ul className="mt-3 space-y-2 text-slate-500">
                <li><Link href="/signup" className="hover:text-blue-700">Sign up</Link></li>
                <li><Link href="/login" className="hover:text-blue-700">Log in</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-100 pt-6">
          <p className="text-xs leading-relaxed text-slate-400">
            Compliance Hub is a tracking and workflow tool, not a source of
            legal or financial advice. Always confirm requirements with the
            Charity Commission, Companies House, ICO, HMRC and your
            professional advisers. DBS checks are always carried out through
            an authorised umbrella body — this product only tracks dates.
          </p>
          <p className="mt-4 text-xs text-slate-400">
            © {new Date().getFullYear()} Compliance Hub.
          </p>
        </div>
      </div>
    </footer>
  );
}
