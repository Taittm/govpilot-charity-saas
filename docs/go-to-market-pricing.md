# Go-to-Market Pricing (Phase 8)

**Status:** Market scan complete, starting price recommended. Full pricing memo with
comparison table and chart published as an artifact — link kept by whoever ran this
session; this document is the durable, in-repo record of the research and the
recommendation itself.

Phase 8 is explicitly business/marketing work, not a coding phase — see the phase list in
[CLAUDE.md](../CLAUDE.md). This covers just the pricing piece of it.

## The market

Nine UK products (plus one comparable US product) across four adjacent categories, plus
what charities currently pay a human to run a manual health check — the service this
product turns into software. No direct competitor combines Charity Commission, Companies
House, ICO, HMRC, and DBS deadlines in one calendar with a multi-client consultant view.

| Category | Product | Plan | Price | Notes |
|---|---|---|---|---|
| Free self-assessment | Charity Excellence Framework | Health check | £0 | Free governance questionnaire + resource hub. No calendar, no client management, no filings. |
| Fundraising CRM | Donorfy | Essentials | £0 | Free up to 250 constituents; Professional from ~£59–69/mo +VAT, scales with constituents. |
| Fundraising CRM | Beacon | Starter | £33.50–£37/mo | 3 users, up to ~2,000 contacts. Standard £104/mo, Premium £230/mo. |
| Fundraising CRM (US) | Little Green Light | Entry | $45/mo (~£35) | Up to 2,500 constituents; +$15/mo per tier above that. |
| Governance / board portal | Governance360 | Foundation | £400/yr +VAT (~£33/mo) | Up to 10 users, aimed at charities with income under ~£500k. |
| Governance / board portal | Convene | Standard | £240/user/yr (~£20/mo) | Per-user, not per-organisation. |
| Companies House filing | Inform Direct | Subscription | £15+VAT/filing PAYG | Filing included free with a subscription; statutory CH fee (£50 from Feb 2026) is separate either way. |
| Practice management (consultant-tier comparator) | Client Engager | Per-client bands | £9–£35/mo | 5 clients ≈ £9/mo (£1.80/client); 50 clients ≈ £35/mo (£0.70/client). Generic, not charity-specific. |
| **Manual service (what this replaces)** | Willow Charity Consulting | One-off health check | **≈ £400–£800+** | A single engagement for a charity under £250k income — the exact service this product productises. |

## Recommendation

**Self-serve (individual charity or CIC): £19/month**, or £190/year (two months free).
One organisation. Priced just above the free alternative (Charity Excellence) and roughly
level with per-user governance tools — a narrower, deadline-focused product, not a full
fundraising CRM, so it doesn't need to match CRM pricing.

**Consultant / agency: £15/client/month**, no base platform fee:

| Clients managed | Price per client | Monthly total example |
|---|---|---|
| 1–9 | £15/mo | 5 clients → £75/mo |
| 10–24 | £12/mo | 15 clients → £180/mo |
| 25+ | £9/mo | 30 clients → £270/mo |

### Why these numbers

- **Anchor to the service, not just the software.** The real competitor for the
  consultant tier isn't Beacon or Donorfy — it's the consultant's own billable hours.
  £15/client/month is trivial next to a single £400+ manual health check, for every
  client, every month.
- **Price the self-serve tier above free, not above the CRMs.** Charity Excellence's free
  health check is a real substitute for one feature of this product; £19/month only makes
  sense once the calendar, document vault, and multi-regulator tracking are visibly doing
  work a free static questionnaire can't.
- **Match the market's own annual-discount convention.** Beacon discounts ~10% annually,
  Donorfy ~2–5%; a ~17% annual discount (two months free) is generous without being
  unusual for the category.
- **Leave room to grow into it.** This doesn't price Phase 4–6 features (accounts-tier
  calculator, Gift Aid/GASDS tracking, grants) separately — they're already bundled, which
  is more product for the same money than any comparator above offers.

## Sources

- [Beacon — Pricing and Plans](https://www.beaconcrm.org/pricing)
- [Donorfy — Pricing](https://donorfy.com/pricing)
- [Little Green Light — Pricing](https://www.littlegreenlight.com/pricing/)
- [Inform Direct — Pricing](https://www.informdirect.co.uk/business-overview/pricing/)
- [Charity Excellence — Free Quality Mark](https://www.charityexcellence.co.uk/charity-quality-mark/)
- [Governance360 — Board Portal](https://governance360.com/platform/board-portal/)
- [Convene — UK Charity Board Portal](https://www.azeusconvene.com/en-gb/charities)
- [Bright — Practice management software cost (per-client comparator)](https://brightsg.com/blog/how-much-does-practice-management-software-cost-for-accounting-firms-in-the-uk/)
- [Willow Charity Consulting — Health Checks](https://www.willowcharityconsulting.co.uk/health-checks/)

*Sourced 17 September 2026 — re-check before anything client-facing goes live, since
SaaS pricing pages change without notice.*
