import type { ScheduleEvent } from "@/types/schedule";
import { EventRow } from "./EventCard";

/**
 * The band above the grid, holding everything that has a date but no hour:
 * calibration due dates projected off the catalogue, and entries whose window
 * nobody has pinned yet.
 *
 * Full width rather than divided into the grid's columns, because a date-only
 * event is not booked against anybody's clock — an overdue calibration belongs
 * to the lab, not to whoever happens to be in. Pinning a window is what moves
 * a card out of here and into a column.
 *
 * It scrolls at four rows. A quiet week shows one or two; the day a quarter's
 * calibrations all come due it must not push the grid off the screen.
 */
export function AllDayBand({ events }: { events: ScheduleEvent[] }) {
  if (events.length === 0) return null;

  return (
    <div className="flex items-start gap-3 border-b border-border bg-surface-2 px-3 py-2.5">
      <span className="w-[52px] flex-none pt-1 text-[10px] font-medium tracking-[0.06em] text-text-4 uppercase">
        All day
      </span>
      <div className="flex max-h-[132px] min-w-0 flex-1 flex-col gap-1 overflow-y-auto">
        {events.map((event) => (
          <EventRow key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
