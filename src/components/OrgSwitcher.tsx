"use client";

import { useRouter, useParams } from "next/navigation";

type OrgOption = {
  organisationId: string;
  organisationName: string;
};

export function OrgSwitcher({ options }: { options: OrgOption[] }) {
  const router = useRouter();
  const params = useParams<{ orgId?: string }>();
  const currentOrgId = params?.orgId;

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="org-switcher" className="text-sm text-gray-500">
        Client
      </label>
      <select
        id="org-switcher"
        className="rounded-md border border-gray-300 px-2 py-1 text-sm"
        value={currentOrgId ?? ""}
        onChange={(e) => router.push(`/dashboard/${e.target.value}`)}
      >
        {options.map((o) => (
          <option key={o.organisationId} value={o.organisationId}>
            {o.organisationName}
          </option>
        ))}
      </select>
      <a
        href="/dashboard/new"
        className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700 hover:bg-gray-50"
      >
        + New organisation
      </a>
    </div>
  );
}
