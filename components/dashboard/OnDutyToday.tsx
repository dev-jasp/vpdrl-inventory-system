import Link from "next/link";

import { Avatar } from "@/components/ui/Avatar";
import { TODAY } from "@/lib/shared/dates";
import { onDuty } from "@/lib/staff/schedule";
import { allStaff } from "@/lib/staff/store";

/** The design shows six faces before collapsing the rest into a "+N" chip. */
const VISIBLE = 6;

/**
 * Who is rostered on today, from `design/LabTrack Dashboard.dc.html`: a row of
 * avatars with the overflow linking through to the staff list.
 */
export function OnDutyToday() {
  const roster = onDuty(allStaff(), TODAY);
  const shown = roster.slice(0, VISIBLE);
  const overflow = roster.length - shown.length;

  return (
    <div className="flex flex-wrap items-center gap-3.5">
      <span className="text-[11px] font-semibold tracking-[0.1em] text-text-4">
        ON DUTY TODAY
      </span>
      <ul
        aria-label={`${roster.length} on duty today`}
        className="flex items-center gap-[7px]"
      >
        {shown.map((person) => (
          // The design opens the staff profile from here, which is a link to
          // it here; the dashboard is not the staff list, so it carries no
          // filters and Close lands on the plain list.
          <li key={person.id} title={`${person.name} · ${person.role}`}>
            <Link href={`/staff/${person.id}`} className="block">
              <Avatar id={person.id} name={person.name} photo={person.photo} />
              <span className="sr-only">
                {person.name} · {person.role}
              </span>
            </Link>
          </li>
        ))}
        {overflow > 0 ? (
          <li>
            <Link
              href="/staff"
              className="grid size-[34px] flex-none place-items-center rounded-full bg-muted text-[11px] font-semibold text-text-2"
            >
              <span aria-hidden>+{overflow}</span>
              <span className="sr-only">
                {overflow} more on duty — see the staff list
              </span>
            </Link>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
