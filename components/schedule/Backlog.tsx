import Link from "next/link";

import { Icon } from "@/components/ui/Icon";
import { longDate, fromISO } from "@/lib/shared/dates";
import { KIND_LABELS, type ScheduleEvent } from "@/types/schedule";
import { StatusPill } from "./EventCard";

/**
 * Everything still waiting on a window, across every date.
 *
 * The all-day band shows the unscheduled entries for one day; this is the same
 * state asked about globally, which is the question somebody planning a week
 * actually has: what have we agreed to that nobody has put an hour against.
 * Oldest first, because the ones that have been sitting longest are the ones
 * the supplier has stopped chasing.
 */
export function Backlog({ events }: { events: ScheduleEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1.5 px-6 py-16 text-center">
        <Icon name="check" className="size-6 text-text-3" />
        <p className="text-[14px] font-medium">Everything has a window.</p>
        <p className="text-[12.5px] font-normal text-text-3">
          Nothing on the calendar is waiting to be booked in.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border-soft">
      {events.map((event) => (
        <li key={event.id}>
          <Link
            href={event.href ?? "#"}
            className="flex items-center gap-3 px-[22px] py-3.5 hover:bg-surface-2"
          >
            <span className="w-[104px] flex-none font-mono text-[12px] font-extrabold text-text-2">
              {longDate(fromISO(event.date))}
            </span>
            <span className="w-[74px] flex-none text-[11px] font-medium tracking-[0.04em] text-text-4 uppercase">
              {KIND_LABELS[event.kind]}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium">
                {event.title}
              </span>
              {event.subtitle ? (
                <span className="block truncate text-[11.5px] font-normal text-text-3">
                  {event.subtitle}
                </span>
              ) : null}
            </span>
            <StatusPill tone={event.tone}>{event.status}</StatusPill>
            <span className="flex-none text-[12px] font-medium text-accent-fg">
              Pin a window →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
