# UK Charity & CIC Compliance SaaS — Project Context

**Product:** a multi-tenant SaaS that helps small UK charities and CICs (Community Interest Companies) stay on top of legal/regulatory compliance — annual filings, governance, safeguarding, data protection, fundraising rules — replacing spreadsheets and paper files. Go-to-market starts as a manually-delivered compliance service (health checks and compliance kits), which this software turns into a repeatable, partly self-serve product. Two tenant shapes matter from the start: a **consultant/agency account** managing many client organisations, and an **individual charity/CIC** managing itself.

**Build platform:** the original spec called for Bubble (no-code). This repo is a **coded prototype** instead — Next.js (App Router, TypeScript) + Prisma + SQLite for local dev (schema is Postgres-compatible; swap the Prisma datasource to Postgres for production). Revisit the no-code-vs-coded decision once real usage data exists (see Phase 6).

> **Naming note:** the working name "Govpilot" is already used by a US company (GovPilot Inc., Brick, NJ) selling permitting software to US local governments — different country and market, so no issue using it privately or with early clients, but pick a distinct public brand before wide launch.

## UK regulatory cheat sheet (the rules the product encodes)

- **Charity Commission:** registration required over £5,000 income; annual return due within 10 months of financial year end; three reporting tiers by income (under £10k / £10k–£25k / over £25k, the last requiring Trustees' Annual Report + accounts + examiner's report). **From 30 September 2026**, thresholds change: receipts & payments accounts up to £500k income (was £250k); independent examination required above £40k (was £25k); professionally-qualified examiner above £500k; statutory audit above £1.5m income or £5m assets (was £1m/£3.26m). Both threshold sets are live simultaneously during the transition, keyed by financial year.
- **CIC:** files a CIC34 Community Interest Company Report annually with Companies House (simplified or detailed version), plus a standard confirmation statement (CS01, 12-month cycle, 14 days to file, £34 online) and annual accounts like any company. Regulated by the Office of the Regulator of CICs, not the Charity Commission. Asset lock is permanent; dividend cap 35%/year (5-year carry-forward); performance-related interest cap 20%.
- **ICO/UK GDPR:** annual data protection fee — Tier 1 £52, Tier 2 £78, Tier 3 £3,763 (£5 Direct Debit discount). Charities pay Tier 1 (£52) regardless of size, unless exempt.
- **Gift Aid/GASDS:** 25% top-up on cash/contactless donations up to £30 each, £8,000/year cap, capped at 10× the charity's matched Gift Aid claim that year; charity must have claimed Gift Aid in the current year or 2 of the last 4.
- **DBS checks:** enhanced for regulated activity with children/vulnerable adults, standard for some other trust roles, basic for general trustee/admin roles. Volunteer checks are free. From 5 October 2026: Basic/Standard £20, Enhanced £41, Update Service £15/year. **The product never performs checks itself** — it links to an external umbrella body and only tracks type/date/expiry.
- **Reference tools already in this space:** Beacon, Donorfy, Little Green Light (fundraising CRMs with Gift Aid), Inform Direct (Companies House filings), Charity Excellence Framework (free self-assessment). None combine Charity Commission + Companies House + ICO + HMRC + DBS deadlines into one calendar, and none serve a multi-client consultant — that gap is the product.

*Regulatory facts sourced from: gov.uk (charity annual return guidance, CIC34 guidance, DBS fee announcement), ICO (data protection fee tiers), Kreston Reeves and ICAEW (Charities SORP 2026 threshold changes), CharityIQ (GASDS), KG Accountants (CIC confirmation statement filing). Verify exact figures against gov.uk/Charity Commission/Companies House directly before anything client-facing goes live, since several thresholds are mid-transition as of late 2026.*

## Build order (work one phase at a time)

- **Phase 0 — Foundations** *(current)*: data model spine, auth, consultant vs. individual tenant shape, empty dashboard shell. No compliance features yet.
- **Phase 1 — Consultant console + Health Check**: red/amber/green questionnaire, versioned results, PDF export, compliance kit export.
- **Phase 2 — Compliance calendar & document vault**: deadline engine (Charity Commission / CIC34 / ICO), reminders, consultant aggregate view, document storage.
- **Phase 3 — Governance module**: trustee/director register, DBS date tracking feeding the calendar, meetings/minutes, conflicts of interest, policy review dates.
- **Phase 4 — Financial compliance module**: accounts-tier calculator (pre/post 30 Sept 2026 thresholds), examiner/auditor directory, Gift Aid/GASDS tracker.
- **Phase 5 — Data protection module**: ICO fee tracking, privacy/retention templates, breach log, subject access request tracker.
- **Phase 6 — Grants tracker + self-serve opening**: funding/grant tracking, direct charity signup, coded-rebuild decision checkpoint (already made — see Build platform above).
- **Phase 7 — Platform compliance & security hardening**: ICO registration as controller/processor, DPA template, retention/deletion policy, Cyber Essentials, backup/DR with tested restore.
- **Phase 8 — Go-to-market** *(not a coding phase)*: reference clients, sector body relationships, dual pricing (consultant per-client fee vs. self-serve tier).

Each phase has an explicit "out of scope" list and "done when" criteria in the original spec — ask if you need the full phase-by-phase detail restored; this file keeps the persistent context, not the moment-to-moment task list.
