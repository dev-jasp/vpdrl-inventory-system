import { Avatar } from "@/components/ui/Avatar";
import { eventsOn, laneOnDuty, type ScheduleLane } from "@/lib/schedule/layout";
import { fromISO, isoDate } from "@/lib/shared/dates";
import { DAY_LABELS } from "@/lib/staff/schedule";
import { TODAY } from "@/lib/shared/dates";
import { cx } from "@/utils/cx";
import { EventChip } from "./EventCard";

/** Chips a cell shows before it gives up and counts the rest. */
const VISIBLE = 3;

/**
 * The week: people down, days across, no hour rows.
 *
 * The axis stays on people rather than swapping to days, so both views answer
 * the same question. What that buys is the rota: `Staff.days` is seven
 * characters Monday-first, which is exactly this grid's shape, so a person's
 * off-days grey straight across their row and the week view is the schedule
 * and the rota at once. An entry sitting on a hatched cell is somebody booked
 * on their day off, visible at a glance across the whole week.
 */
export function WeekGrid({
  lanes,
  dates,
}: {
  lanes: ScheduleLane[];
  /** The seven ISO dates, Monday first. */
  dates: string[];
}) {
  const today = isoDate(TODAY);

  return (
    <div className="overflow-x-auto">
      <div
        className="grid min-w-max"
        style={{ gridTemplateColumns: `180px repeat(7, minmax(132px, 1fr))` }}
      >
        <div className="sticky top-0 z-2 border-b border-border bg-surface" />
        {dates.map((date, index) => {
          const day = fromISO(date);
          return (
            <div
              key={date}
              className={cx(
                "sticky top-0 z-2 border-b border-l border-border px-3 py-2.5",
                date === today ? "bg-tint-blue" : "bg-surface",
              )}
            >
              <div
                className={cx(
                  "text-[11px] font-medium tracking-[0.05em] uppercase",
                  date === today ? "text-accent-fg" : "text-text-4",
                )}
              >
                {DAY_LABELS[index].slice(0, 3)}
              </div>
              <div className="font-mono text-[13px] font-extrabold">
                {day.getDate()}
              </div>
            </div>
          );
        })}

        {lanes.map((lane) => (
          <Row key={lane.key} lane={lane} dates={dates} today={today} />
        ))}
      </div>
    </div>
  );
}

function Row({
  lane,
  dates,
  today,
}: {
  lane: ScheduleLane;
  dates: string[];
  today: string;
}) {
  const total = dates.reduce(
    (count, date) => count + eventsOn(lane, date).length,
    0,
  );

  return (
    <>
      <div className="flex items-center gap-2.5 border-b border-border px-3 py-3">
        {lane.staff ? (
          <Avatar
            id={lane.staff.id}
            name={lane.staff.name}
            photo={lane.staff.photo}
            className="size-7 text-[10px]"
          />
        ) : (
          <span className="grid size-7 flex-none place-items-center rounded-full border border-dashed border-border-strong text-[11px] font-medium text-text-3">
            ?
          </span>
        )}
        <div className="min-w-0">
          <div className="truncate text-[12.5px] font-medium">{lane.label}</div>
          <div className="text-[11px] font-normal text-text-3">
            <span className="font-mono font-extrabold">{total}</span> this week
          </div>
        </div>
      </div>

      {dates.map((date) => {
        const events = eventsOn(lane, date);
        const duty = laneOnDuty(lane, date);
        const shown = events.slice(0, VISIBLE);
        const rest = events.length - shown.length;

        return (
          <div
            key={date}
            className={cx(
              "flex min-h-[74px] flex-col gap-1 border-b border-l border-border p-1.5",
              // Off duty is a hatch rather than a flat fill, so an event drawn
              // on top of it still reads as being on top of something wrong.
              duty
                ? date === today
                  ? "bg-tint-blue/30"
                  : ""
                : "bg-[repeating-linear-gradient(135deg,var(--grid-soft)_0_6px,transparent_6px_12px)]",
            )}
          >
            {shown.map((event) => (
              <EventChip key={event.id} event={event} />
            ))}
            {rest > 0 ? (
              <span className="px-1 text-[10.5px] font-normal text-text-3">
                +{rest} more
              </span>
            ) : null}
          </div>
        );
      })}
    </>
  );
}
