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
 * The chips flow along the band and wrap, rather than stacking one per line.
 * A date-only event carries about four words, so a line of them holds two or
 * three — stacked, each one spent the band's whole width to say very little.
 *
 * It scrolls at four lines. A quiet week shows one; the day a quarter's
 * calibrations all come due it must not push the grid off the screen.
 */
export function AllDayBand({ events }: { events: ScheduleEvent[] }) {
  if (events.length === 0) return null;

  return (
    <div className="flex items-start gap-3 border-b border-border bg-surface-2 px-3 py-2.5">
      <span className="w-[52px] flex-none pt-1 text-[10px] font-medium tracking-[0.06em] text-text-4 uppercase">
        All day
      </span>
      <div className="flex max-h-[132px] min-w-0 flex-1 flex-wrap items-start gap-1.5 overflow-y-auto">
        {events.map((event) => (
          <EventRow key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
