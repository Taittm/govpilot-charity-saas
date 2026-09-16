import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMembershipsForUser } from "@/lib/orgs";

export default async function DashboardIndex() {
  const session = await auth();
  if (!session) redirect("/login");

  const memberships = await getMembershipsForUser(session.user.id);

  if (memberships.length === 0) {
    redirect("/dashboard/new");
  }

  redirect(`/dashboard/${memberships[0].organisationId}`);
}
