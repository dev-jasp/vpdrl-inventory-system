import Link from "next/link";

import { Avatar } from "@/components/ui/Avatar";
import { STAFF } from "@/data/staff";
import { TODAY } from "@/lib/shared/dates";
import { onDuty } from "@/lib/staff/schedule";

/** The design shows six faces before collapsing the rest into a "+N" chip. */
const VISIBLE = 6;

/**
 * Who is rostered on today, from `design/LabTrack Dashboard.dc.html`: a row of
 * avatars with the overflow linking through to the staff list.
 */
export function OnDutyToday() {
  const roster = onDuty(STAFF, TODAY);
  const shown = roster.slice(0, VISIBLE);
  const overflow = roster.length - shown.length;

  return (
    <div className="flex flex-wrap items-center gap-3.5">
      <span className="text-[11px] font-bold tracking-[0.1em] text-text-4">
        ON DUTY TODAY
      </span>
      <ul
        aria-label={`${roster.length} on duty today`}
        className="flex items-center gap-[7px]"
      >
        {shown.map((person) => (
          // TODO: the design opens the staff profile dialog from here; there is
          // no profile view yet, so this is a label-only avatar.
          <li key={person.id} title={`${person.name} · ${person.role}`}>
            <Avatar id={person.id} name={person.name} photo={person.photo} />
            <span className="sr-only">
              {person.name} · {person.role}
            </span>
          </li>
        ))}
        {overflow > 0 ? (
          <li>
            <Link
              href="/staff"
              className="grid size-[34px] flex-none place-items-center rounded-full bg-muted text-[11px] font-bold text-text-2"
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
