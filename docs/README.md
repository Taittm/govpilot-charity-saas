# Platform Compliance & Security Hardening (Phase 7)

This folder holds the process/infrastructure documents Phase 7 calls for. Unlike Phases
0–6, this phase is explicitly *not* new app features — see `CLAUDE.md`'s phase list — so
there's no corresponding code change, just these documents plus one thing that could
actually be executed and verified: a tested backup restore.

| Document | What it covers | Status |
|---|---|---|
| [`data-processing-agreement-template.md`](./data-processing-agreement-template.md) | DPA to issue to each client organisation | Template drafted, ready to issue; not yet signed with any client (none exist yet) |
| [`platform-data-retention-policy.md`](./platform-data-retention-policy.md) | What data the platform holds, how long, how it's deleted | Documented and current |
| [`cyber-essentials-checklist.md`](./cyber-essentials-checklist.md) | Readiness against the 5 Cyber Essentials control themes | Not started; groundwork assessed and gaps identified |
| [`backup-disaster-recovery-plan.md`](./backup-disaster-recovery-plan.md) | Backup approach, recovery procedure, and a real restore test | **Restore tested successfully** on 16 September 2026 |
| [`ico-registration-checklist.md`](./ico-registration-checklist.md) | Registering the platform itself with the ICO | Not started — real-world action for whoever operates the platform |

## Against Phase 7's "done when" criteria

- **"DPAs are in place with existing clients"** — not yet true, and can't be made true
  from inside this prototype: there are no real clients to sign one with. The template is
  ready to issue the moment a real client exists.
- **"A backup restore has been tested successfully"** — ✅ done. Full evidence log in
  `backup-disaster-recovery-plan.md`: file-level checksum match, application-level row
  count match across all 14 data tables, and a live browser check confirming the restored
  data renders correctly.
- **"Cyber Essentials is achieved or in progress with evidence being collected"** — in
  progress in the sense that groundwork has been assessed and gaps identified; actual
  certification requires a paid external audit against a real deployed environment, which
  doesn't exist yet for this prototype.

## What this means practically

Three of Phase 7's four deliverables (ICO registration, Cyber Essentials certification,
and signed DPAs with real clients) require real-world business action — creating accounts,
paying fees, and dealing with actual clients — that has to happen outside a coding session,
under the operating business's real identity. This folder gets everything *ready* for that
action; it can't complete the action itself.
