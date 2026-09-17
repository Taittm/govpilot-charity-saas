import type { RoleName } from "@prisma/client";

// Two-tier model: CONSULTANT_ADMIN/TRUSTEE_DIRECTOR/STAFF run the organisation
// day-to-day and can write; VOLUNTEER/READ_ONLY can view everything but
// change nothing. Managing who has access (inviting, changing roles,
// removing) is narrower still — CONSULTANT_ADMIN only.
const WRITE_ROLES = new Set<RoleName>(["CONSULTANT_ADMIN", "TRUSTEE_DIRECTOR", "STAFF"]);

export function canWrite(role: RoleName): boolean {
  return WRITE_ROLES.has(role);
}

export function canManageMembers(role: RoleName): boolean {
  return role === "CONSULTANT_ADMIN";
}

export const ROLE_LABEL: Record<RoleName, string> = {
  CONSULTANT_ADMIN: "Consultant / admin",
  TRUSTEE_DIRECTOR: "Trustee / director",
  STAFF: "Staff",
  VOLUNTEER: "Volunteer",
  READ_ONLY: "Read only",
};

export const ROLE_OPTIONS: RoleName[] = ["CONSULTANT_ADMIN", "TRUSTEE_DIRECTOR", "STAFF", "VOLUNTEER", "READ_ONLY"];
