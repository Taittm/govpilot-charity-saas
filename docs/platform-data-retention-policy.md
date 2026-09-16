# Platform Data Retention & Deletion Policy

**Status:** Documented and current for the prototype's actual data model. This is the
platform's own retention policy as a data processor/controller — distinct from the
per-organisation privacy notice and retention policy *templates* that clients edit for
their own donors/beneficiaries (Phase 5, `data-protection/templates`).

## What data the platform holds

| Category | Examples | Where |
|---|---|---|
| Account data | User email, hashed password, name | `User` table |
| Organisation data | Name, type, income band, financial year end | `Organisation` table |
| Compliance records | Health checks, trustees, meetings, policies, financial years, donations, ICO registration, breaches, subject access requests, grants | Respective tables, all scoped to an `organisationId` |
| Uploaded documents | Governing documents, minutes, policies, privacy/retention templates | `Document` table, stored as binary content plus metadata |

## Retention periods

- **Active accounts**: data is retained for as long as the account and its organisations
  remain active — this is operational data the client needs day-to-day, not archival data
  with a fixed retention clock.
- **Closed/cancelled accounts**: on request, an organisation's data is deleted within
  [30] days, except where the platform is required to retain records for its own legal or
  regulatory obligations (e.g. financial records of the platform's own billing, which sit
  outside this application's database).
- **Backups**: retained per the backup/disaster-recovery plan; a deleted organisation's
  data will persist in backups until those backups themselves age out of the retention
  window, after which it is gone completely.
- **Session/auth tokens**: JWT sessions expire automatically (30-day default) and are not
  separately persisted server-side.

## Deletion mechanism

Cascading deletes are enforced at the database level: every compliance record is linked
to its `Organisation` with `onDelete: Cascade` (see `prisma/schema.prisma`), so deleting
an `Organisation` row deletes every health check, document, trustee, financial record,
and other compliance record scoped to it in one operation — there's no risk of orphaned
personal data left behind by a partial deletion.

*Not yet built: a self-service "delete my organisation" action in the product itself.
Today this would be performed directly against the database by whoever operates the
platform. Building a UI for it is a reasonable Phase 8+ candidate once there are real
accounts to delete.*

## Backups

See `backup-disaster-recovery-plan.md` — because documents are stored as database blobs,
a single database backup covers all platform data, including uploaded files.

## Review

This policy should be reviewed whenever the data model changes materially (a new table
holding personal data) or at least annually.
