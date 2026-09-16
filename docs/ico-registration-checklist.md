# ICO Registration Checklist (Platform as Controller/Processor)

**Status: not started.** Registering with the ICO means creating an account on their site
and paying a statutory fee under the operating business's real legal details — that's a
real-world action for whoever runs the platform to take directly, not something that can
or should be done on their behalf.

## Why the platform needs its own registration

This is separate from the per-client ICO fee tracking already built in the product
(Phase 5, `data-protection/ico`) — that tracks *each client organisation's own* ICO fee.
The platform itself, as the business processing personal data on behalf of its clients
(and holding platform-account data directly), also needs to register as a data controller
in its own right, unless a specific exemption applies.

## Checklist

- [ ] Confirm the platform's legal entity (sole trader / limited company) and registered
      details — needed for the registration form.
- [ ] Check exemption status using the ICO's [self-assessment
      tool](https://ico.org.uk/for-organisations/data-protection-fee/self-assessment/) —
      most small businesses processing personal data are **not** exempt, but confirm
      rather than assume.
- [ ] Determine fee tier (Tier 1 £52 / Tier 2 £78 / Tier 3 £3,763) — likely Tier 1 or 2 at
      this platform's current scale; re-check as headcount/turnover grow.
- [ ] Register and pay via [ico.org.uk/registration](https://ico.org.uk/registration/) (a
      Direct Debit saves £5/year and avoids a manual annual renewal).
- [ ] Record the registration reference number and renewal date somewhere durable (e.g.
      this repo's project notes, or wherever the business tracks its own compliance —
      deliberately not inside this app's own database, since the app models *client*
      organisations' ICO registrations, not the platform's own).
- [ ] Set a renewal reminder (annual).

## Also needed alongside registration

- A public-facing privacy notice for the platform itself (who signs up, whose data is
  processed, on what basis) — distinct from the per-organisation privacy notice template
  clients edit for their own donors inside the product.
- The Data Processing Agreement (`data-processing-agreement-template.md`) issued to each
  client, since the platform acts as a processor of the client's data.
