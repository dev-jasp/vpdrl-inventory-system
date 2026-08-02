import { Avatar } from "@/components/ui/Avatar";
import { hourLabel } from "@/lib/schedule/events";
import {
  eventsOn,
  hourWindow,
  laneOnDuty,
  placeEvents,
  type ScheduleLane,
} from "@/lib/schedule/layout";
import { TIME_ZONE_LABEL } from "@/lib/shared/dates";
import type { ScheduleEvent } from "@/types/schedule";
import { cx } from "@/utils/cx";
import { EventBlock } from "./EventCard";

/**
 * Height of one hour row, and the number this whole view turns on.
 *
 * At 64 the grid fitted a working day on one screen and paid for it in the
 * cards: half an hour was 32px, which is a title and nothing else — no window,
 * no status — so the grid showed *that* something was booked without showing
 * what. 96 makes the shortest thing anyone books 48px, which is the height at
 * which a card carries its window and its pill, and a normal hour carries its
 * supplier line too. The day is then taller than the viewport and scrolls,
 * which is the right trade: a calendar you scroll beats a calendar you squint
 * at.
 */
const HOUR = 96;

/**
 * The day: people across, hours down, each window drawn as a block sized by
 * its duration — the reference screenshot's skeleton, on this app's tokens.
 *
 * Columns are only the people with work on (`lanesFor`), so the grid stays
 * readable at a lab's fourteen staff. A column whose owner is *not* rostered
 * that day says so and tints: booking somebody onto their day off is a thing
 * the app should let you see, not a thing it should let you do silently.
 */
export function DayGrid({
  lanes,
  date,
  events,
}: {
  lanes: ScheduleLane[];
  date: string;
  /** Everything timed in view, which sets the hours the grid spans. */
  events: ScheduleEvent[];
}) {
  const window = hourWindow(events);
  const hours = Array.from({ length: window.hours }, (_, i) => window.from + i);
  const bodyHeight = window.hours * HOUR;

  return (
    // The pane scrolls, not the page. `overflow-x-auto` already made this a
    // scroll container on both axes — CSS turns the other axis's `visible`
    // into `auto` — but with no height to overflow it never scrolled
    // vertically, which left the `sticky` on the lane headers below doing
    // nothing. Capping it is what makes them stick: at 96px an hour the day
    // is taller than the viewport, and scrolling to the afternoon must not
    // cost you the row saying whose column is whose.
    <div className="max-h-[max(380px,calc(100vh-16rem))] overflow-auto">
      <div
        className="grid min-w-max"
        style={{
          gridTemplateColumns: `64px repeat(${lanes.length}, minmax(200px, 1fr))`,
        }}
      >
        {/* The corner names the zone the hours below it are in, centred over
            the column of them. */}
        <div className="sticky top-0 z-2 flex items-center justify-center border-b border-border bg-surface px-2 py-2.5">
          <span className="font-mono text-[10px] font-normal tracking-[0.02em] text-text-4">
            {TIME_ZONE_LABEL}
          </span>
        </div>
        {lanes.map((lane) => {
          const duty = laneOnDuty(lane, date);
          return (
            <div
              key={lane.key}
              className={cx(
                "sticky top-0 z-2 flex items-center gap-2.5 border-b border-l border-border px-3 py-2.5",
                duty ? "bg-surface" : "bg-surface-2",
              )}
            >
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
                <div className="truncate text-[12.5px] font-medium">
                  {lane.label}
                </div>
                <div className="text-[11px] font-normal text-text-3">
                  {duty ? (
                    <>
                      <span className="font-mono font-extrabold">
                        {eventsOn(lane, date).length}
                      </span>{" "}
                      today
                    </>
                  ) : (
                    "Not available · off duty"
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/*
          The hour gutter. Labels centre in the column, under the zone that
          names them, and each sits just *below* the line it belongs to rather
          than centred across it: centred across, the first label straddled the
          top of the grid and the header clipped its upper half — the scroller
          scrolls on both axes, so there is nothing for it to overflow into.

          Weight is `font-normal`, against ADR 0001's rule that mono figures
          keep `font-extrabold`. The rule is for readings, and these are not
          readings — they are the ruler the readings are measured against, and
          a ruler that outweighs the cards beside it is reading the page
          backwards.
        */}
        <div className="relative" style={{ height: bodyHeight }}>
          {hours.map((hour, index) => (
            <div
              key={hour}
              className="absolute inset-x-0 pt-1.5 text-center font-mono text-[11px] font-normal text-text-3"
              style={{ top: index * HOUR }}
            >
              {hourLabel(hour)}
            </div>
          ))}
        </div>

        {lanes.map((lane) => {
          const placed = placeEvents(eventsOn(lane, date), window);
          const duty = laneOnDuty(lane, date);

          return (
            <div
              key={lane.key}
              className={cx(
                "relative border-l border-border",
                duty ? "" : "bg-surface-2",
              )}
              style={{ height: bodyHeight }}
            >
              {hours.map((hour, index) => (
                <div
                  key={hour}
                  aria-hidden
                  className="absolute inset-x-0 border-t border-grid-soft"
                  style={{ top: index * HOUR }}
                />
              ))}

              {placed.map(({ event, top, height, lane: slot, lanes: count }) => (
                <div
                  key={event.id}
                  className="absolute px-1"
                  style={{
                    top: `${top}%`,
                    height: `${height}%`,
                    left: `${(slot / count) * 100}%`,
                    width: `${(1 / count) * 100}%`,
                  }}
                >
                  <EventBlock
                    event={event}
                    height={(height / 100) * bodyHeight}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
