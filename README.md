# Compliance Hub — Phase 0 through Phase 8

Coded prototype of the UK charity/CIC compliance SaaS described in [CLAUDE.md](./CLAUDE.md).

- **Phase 0**: auth, the `Organisation` / `User` / `Membership` data model, the
  consultant-vs-individual tenant shape, and an empty per-organisation dashboard shell.
- **Phase 1**: the Health Check questionnaire (governance, safeguarding, financial controls,
  data protection, fundraising, HR/volunteering), scored red/amber/green per section and
  overall, versioned per organisation with a comparison against the previous run, a branded
  PDF-exportable report, and a compliance kit action list generated from the gaps found.
- **Phase 2**: the compliance calendar — Charity Commission annual return, CIC34 +
  confirmation statement, and ICO fee renewal deadlines, computed live from each
  organisation's type/income band/financial year end (see
  [src/lib/deadlines.ts](src/lib/deadlines.ts)) — shown per-organisation and in a
  consultant-wide "All deadlines" aggregate view sorted by urgency, plus a document vault
  for uploading, tagging, versioning, and re-downloading governing documents, filings, and
  policies.
- **Phase 3**: the governance module — a trustee/director register with DBS check type/date/
  expiry (expiry dates automatically join the compliance calendar and the aggregate view;
  the product never performs the checks itself, only links out to an external umbrella body),
  board meeting/AGM scheduling with minutes stored and versioned via the document vault, a
  conflicts-of-interest register, and a policy library whose review dates also feed the
  calendar and get flagged as overdue once past due.
- **Phase 4**: the financial compliance module — an accounts-tier calculator (see
  [src/lib/accounts-tier.ts](src/lib/accounts-tier.ts)) that picks the pre- or
  post-30-September-2026 threshold set from the financial year end entered and returns the
  correct accounts basis (receipts & payments vs. accruals) and level of external scrutiny
  (none / independent examination / professionally-qualified examiner / statutory audit,
  by income and assets), a static independent examiner/auditor referral directory, and a
  Gift Aid/GASDS tracker (see [src/lib/gift-aid.ts](src/lib/gift-aid.ts)) that enforces the
  £30-per-donation GASDS eligibility rule at entry and flags a claim against the £8,000/year
  cap, the 10×-matched-Gift-Aid cap, and the "claimed in the current year or 2 of the last 4"
  eligibility rule.
- **Phase 5**: the data protection module — ICO fee tier tracking (Tier 1/2/3, with an
  override for non-charity CICs) whose renewal date and fee now drive the "ICO data
  protection fee renewal" item on the compliance calendar in place of the Phase 2 default;
  editable privacy notice and data-retention-policy templates that save into the document
  vault with full versioning; a data breach log (date, description, action taken, reported to
  ICO); and a subject access request tracker whose statutory one-calendar-month due date is
  calculated automatically (see [src/lib/sar.ts](src/lib/sar.ts)) and flagged overdue once
  past due.
- **Phase 6**: a funding/grants tracker — application deadlines (while a grant is still
  "Researching" or "Applied") and per-grant reporting obligations both feed the compliance
  calendar, and drop off it once the grant is decided or the obligation is marked done. Plus
  verification that self-serve signup — a charity/CIC creating its own account directly, no
  consultant involved, already built in Phase 0 — still works end-to-end: signup, organisation
  setup, and a working calendar and health check, confirmed via an isolated HTTP session
  script. The coded-vs-no-code platform decision this phase calls for was already made at
  project start (see "Build platform" in [CLAUDE.md](./CLAUDE.md)) — this whole repo is that
  decision.
- **Phase 7**: platform compliance & security hardening — process and documentation, not
  app features, per this phase's explicit scope. See [docs/README.md](docs/README.md) for
  the full picture: a data processing agreement template, the platform's own data
  retention/deletion policy, a Cyber Essentials readiness checklist, an ICO registration
  checklist, and a backup/disaster-recovery plan backed by a real tested restore (file
  checksum + full row-count verification + a live app check, evidence logged in
  [docs/backup-disaster-recovery-plan.md](docs/backup-disaster-recovery-plan.md)). ICO
  registration, Cyber Essentials certification, and signing DPAs with real clients all
  require real-world business action this session can't take on the operator's behalf —
  the docs get everything ready for that action.
- **Phase 8**: go-to-market — pricing only. A market scan of nine comparable UK products
  (plus what consultants currently charge for a manual health check) and a recommended
  starting price: **£19/month self-serve** (individual charity/CIC), **£15/client/month**
  for the consultant/agency tier, tapering with volume. Full comparison table and
  reasoning in [docs/go-to-market-pricing.md](docs/go-to-market-pricing.md). The rest of
  Phase 8 (reference clients, sector body relationships) is real-world business
  development, not something this session can do.

## Stack

- Next.js (App Router, TypeScript) + Tailwind
- Prisma ORM, SQLite for local dev (`prisma/schema.prisma` is Postgres-compatible — swap the
  datasource provider and `DATABASE_URL` to move to Postgres)
- Auth.js (NextAuth v5) with the Credentials provider, bcrypt password hashing, JWT sessions

## Getting started

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed   # optional: creates a demo consultant with two client orgs
npm run dev
```

Then open http://localhost:3000. Sign up as either a consultant/agency account (can hold
multiple client organisations, switchable from the top bar) or an individual charity/CIC
account (manages its own single organisation).

Demo seed login (after `npm run db:seed`): `consultant@example.com` / `password123`.

## What's deliberately not here yet

Phase 8 (go-to-market, including real pricing tiers) hasn't been started — it's explicitly
a business/marketing phase, not a coding one; see the phase list in
[CLAUDE.md](./CLAUDE.md). Health check
answers are not editable after submission and there's no automated reminder to re-run one.
Governance, financial, data-protection, and grants records (trustees, meetings, conflicts,
policies, financial years, donations, breaches, subject access requests, grants, reporting
obligations) can be added but not edited or deleted yet. The examiner/auditor directory is a
static placeholder list, not real vetted suppliers. Nothing files anything with HMRC or
Companies House — this module calculates and tracks, it doesn't submit. The privacy/retention
templates are generic starting points, not legal advice.
Deadline reminders are in-app only (no email sending — not configured for this prototype).
CIC34/confirmation statement and ICO fee renewal dates are anchored to the organisation's
record-creation date as a placeholder for its real incorporation/ICO-registration date, which
this data model doesn't capture yet. Documents are stored as DB blobs (fine at prototype
scale; swap for S3-compatible storage before real client files at volume).
