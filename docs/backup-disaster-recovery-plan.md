# Backup & Disaster Recovery Plan

**Status:** Plan documented; restore procedure tested successfully against the current
(prototype/SQLite) database on 16 September 2026. Production procedure (Postgres +
object storage) is the documented target, not yet built — see "Production target" below.

## What's backed up

At prototype stage, everything lives in one SQLite file (`prisma/dev.db`): every
organisation, user, health check, governance record, financial record, and — because
documents are stored as DB blobs (see `Document.content` in the schema) — every
uploaded document and its version history too. Backing up that one file is a full backup
of the platform's data.

## Backup method (current / prototype)

Manual file copy of `prisma/dev.db`, verified by SHA-256 checksum comparison against the
source file immediately after copying.

## Recovery procedure

1. Stop the application (so nothing is writing to the database file).
2. Copy the most recent verified backup file over the live `prisma/dev.db`.
3. Restart the application.
4. Verify: row counts for key tables match the pre-incident snapshot, and a live login +
   page load succeeds.

## Restore test — evidence log

Performed 16 September 2026, against the running development database, with the
application stopped for the duration of the test.

| Step | Action | Result |
|---|---|---|
| 1 | Captured row counts across all 14 data tables (users, organisations, memberships, health checks, documents, trustees, meetings, policies, donations, ICO registrations, data breaches, subject access requests, grants, grant reporting obligations) | 5 users, 5 organisations, 5 memberships, 4 health checks, 6 documents, 1 trustee, 1 meeting, 1 policy, 2 donations, 1 ICO registration, 1 data breach, 2 subject access requests, 1 grant, 1 reporting obligation |
| 2 | Created backup copy `dev.db.backup-20260916-232420` | 253,952 bytes |
| 3 | Verified backup integrity | SHA-256 of source and backup identical: `E1548FF3...49810B2A` |
| 4 | **Simulated disaster**: deleted the live `dev.db` | File confirmed absent |
| 5 | **Restored**: copied the backup file back to `dev.db` | File confirmed present |
| 6 | Verified restored file integrity | SHA-256 of restored file identical to original: `E1548FF3...49810B2A` |
| 7 | Re-ran the row-count check against the restored database | **Exact match** on every table to step 1 |
| 8 | Restarted the application and loaded a live page in the browser | Previously-created data (including a grant added earlier in the same session) rendered correctly — confirmed the restore works at the application level, not just the file level |

**Result: restore test passed.** Data was fully and correctly recovered with zero loss,
verified at both the file (checksum) and application (row counts + live UI) level.

## Production target (not yet built)

This prototype's manual-copy approach doesn't scale to production. Before handling real
client data at volume, this should become:

- **Database**: managed Postgres (per the schema's stated Postgres-compatibility) with
  automated daily snapshots and point-in-time recovery, retained 30 days.
- **Documents**: move from DB blobs to S3-compatible object storage with versioning and
  cross-region replication (flagged as a future step in the schema's own comments).
- **Automation**: scheduled backup jobs, automated integrity checks, and a *scheduled*
  quarterly restore-test drill (not just a one-off manual test like this one) with results
  logged the same way as above.
- **Recovery time/point objectives**: to be set once real usage patterns and client
  expectations (e.g. from a DPA — see `data-processing-agreement-template.md`) are known.
