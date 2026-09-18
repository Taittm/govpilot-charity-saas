import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { MarketingHome } from "@/components/marketing/MarketingHome";

export default async function Home() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }
  return <MarketingHome />;
}
