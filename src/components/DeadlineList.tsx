import type { Deadline } from "@/lib/deadlines";
import { URGENCY_LABEL, URGENCY_COLOR } from "@/lib/deadlines";

export type DeadlineWithOrg = Deadline & { organisationId: string; organisationName: string };

export function DeadlineList({
  deadlines,
  showOrganisation = false,
}: {
  deadlines: DeadlineWithOrg[];
  showOrganisation?: boolean;
}) {
  if (deadlines.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
        Nothing due.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {deadlines.map((d) => {
        const color = URGENCY_COLOR[d.urgency];
        return (
          <li
            key={`${d.organisationId}-${d.type}-${d.label}-${d.dueDate.getTime()}`}
            className="flex items-center justify-between rounded-md border border-gray-200 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium">
                {d.label}
                {showOrganisation && (
                  <>
                    {" "}
                    ·{" "}
                    <a href={`/dashboard/${d.organisationId}`} className="text-gray-500 hover:underline">
                      {d.organisationName}
                    </a>
                  </>
                )}
              </p>
              <p className="text-xs text-gray-500">{d.detail}</p>
            </div>
            <div className="flex items-center gap-3 whitespace-nowrap">
              <span className="text-sm text-gray-700">
                {d.dueDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </span>
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${color.bg} ${color.text}`}>
                {d.urgency === "OVERDUE" ? `Overdue by ${Math.abs(d.daysUntil)}d` : URGENCY_LABEL[d.urgency]}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
