# Cyber Essentials Readiness Checklist

**Status: not started (certification requires a paid external audit against a real
deployed environment).** This checklist tracks readiness against the five Cyber Essentials
control themes so evidence is being collected as the platform matures, per the Phase 7
target ("achieved or in progress with evidence being collected"). Certification itself —
choosing a certifying body, paying the fee, and passing the (self-assessment or
Plus-level externally tested) audit — is a real-world business action for whoever operates
the platform, not something achievable inside this prototype.

## Why this matters

Funders and larger charities increasingly expect a supplier handling their compliance and
donor data to hold Cyber Essentials (the UK-government-backed baseline, roughly
equivalent in purpose to SOC 2 in other markets) before they'll adopt it. Getting this in
place early removes a sales blocker later.

## The five control themes

### 1. Firewalls
**Status: not applicable yet.** No production deployment exists — this runs as a local
development server. Once deployed, this means: a firewall (or equivalent — e.g. a cloud
provider's security groups) in front of every device and service, default-deny inbound,
admin interfaces not exposed to the public internet.

### 2. Secure configuration
**Partial groundwork in place.**
- ✅ No default credentials: authentication uses per-user bcrypt-hashed passwords (see
  `src/auth.ts`), not shared or default logins.
- ✅ Unnecessary functionality isn't exposed: there's no admin backdoor route or debug
  endpoint left in the API surface.
- ❌ Not yet done: a documented secure-configuration baseline for the actual hosting
  environment (OS/container hardening, disabled unnecessary services) — moot until there's
  a real deployment target to harden.

### 3. Security update management
**Not yet formalised.** No process currently tracks dependency vulnerabilities or applies
updates on a schedule. Before certification, this needs: automated dependency vulnerability
scanning (e.g. `npm audit` or Dependabot) wired into the build, and a documented patching
SLA (Cyber Essentials expects critical/high vulnerabilities patched within 14 days).

### 4. User access control
**Partial groundwork in place.**
- ✅ Role-based membership model: every user's access to an organisation is scoped via an
  explicit `Membership` record with a role (see `prisma/schema.prisma`), not implicit
  or global.
- ✅ Passwords are hashed, never stored or logged in plain text.
- ❌ Not yet done: multi-factor authentication (not implemented for any account),
  a password complexity/rotation policy, and a documented account offboarding process
  (removing access when someone leaves a client organisation or the platform team).

### 5. Malware protection
**Not applicable yet.** This control is about endpoint/server malware protection in a real
deployed environment — nothing to assess until infrastructure exists.

## Immediate next actions (once a production deployment target is chosen)

1. Stand up the production environment (see "Production target" in
   `backup-disaster-recovery-plan.md`) with a real firewall/security-group configuration.
2. Add MFA to the auth flow.
3. Wire dependency vulnerability scanning into CI.
4. Write the secure-configuration baseline and access-offboarding process as documents.
5. Register with an accredited Cyber Essentials certification body and complete the
   self-assessment questionnaire (Cyber Essentials) or externally-tested audit
   (Cyber Essentials Plus).
