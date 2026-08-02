import { isOnDuty } from "@/lib/staff/schedule";
import { fromISO } from "@/lib/shared/dates";
import type { Staff } from "@/types/staff";
import type { ScheduleEvent } from "@/types/schedule";
import { minutesOf } from "./events";

/**
 * The geometry both grids are drawn on.
 *
 * The day grid is people across and hours down; the week grid is people down
 * and days across. Keeping the arithmetic here rather than in the components
 * is what lets the two share one idea of who gets a lane and who is off duty.
 */

/** The key the unassigned column and row travel under. */
export const UNASSIGNED = "none";

export type ScheduleLane = {
  key: string;
  /** Null on the unassigned lane, which belongs to nobody. */
  staff: Staff | null;
  label: string;
  events: ScheduleEvent[];
};

/**
 * Who gets a column or a row: whoever has work in view, in staff-list order,
 * with the unassigned lane last.
 *
 * Not everybody on the rota. Thirteen technicians are on duty on a Wednesday
 * and two of them have anything dated; columns for the other eleven would be
 * eleven columns of air, and the horizontal scroll they cost is paid by the
 * two that matter. Who is *in* is the week grid's job, where the rota reads
 * across a row and empty days are the point.
 */
export function lanesFor(
  events: ScheduleEvent[],
  staff: Staff[],
): ScheduleLane[] {
  const byOwner = new Map<string, ScheduleEvent[]>();
  for (const event of events) {
    const key = event.ownerId ?? UNASSIGNED;
    const bucket = byOwner.get(key);
    if (bucket) bucket.push(event);
    else byOwner.set(key, [event]);
  }

  const lanes: ScheduleLane[] = staff
    .filter((person) => byOwner.has(person.id))
    .map((person) => ({
      key: person.id,
      staff: person,
      label: person.name,
      events: byOwner.get(person.id) as ScheduleEvent[],
    }));

  const orphans = byOwner.get(UNASSIGNED);
  if (orphans) {
    lanes.push({
      key: UNASSIGNED,
      staff: null,
      label: "Unassigned",
      events: orphans,
    });
  }

  return lanes;
}

/**
 * The hours the grid spans, as whole hours.
 *
 * A fixed 08:00–18:00 would clip a 07:30 delivery, and a window computed
 * purely from the data would make the grid jump height every time somebody
 * pages to a quieter day. So: the working day always, widened to hold anything
 * outside it.
 */
export function hourWindow(events: ScheduleEvent[]) {
  let from = 8;
  let to = 18;

  for (const event of events) {
    if (!event.start) continue;
    const start = minutesOf(event.start);
    const end = start + (event.minutes ?? 0);
    from = Math.min(from, Math.floor(start / 60));
    to = Math.max(to, Math.ceil(end / 60));
  }

  return { from, to, hours: to - from };
}

export type PlacedEvent = {
  event: ScheduleEvent;
  /** Percentages down the column, so the grid can be sized in CSS alone. */
  top: number;
  height: number;
  /** Which of `lanes` side-by-side slots this one occupies. */
  lane: number;
  lanes: number;
};

/**
 * Lay one person's day out, splitting the width between events that overlap.
 *
 * Overlaps are resolved per *cluster* rather than per column: two events at
 * 10:00 halve the width between them, but a third at 16:00 that touches
 * neither keeps the full width. Sharing the count across the whole column
 * would narrow a lone afternoon meeting because the morning was busy.
 */
export function placeEvents(
  events: ScheduleEvent[],
  window: { from: number; hours: number },
): PlacedEvent[] {
  const span = window.hours * 60;
  const offset = window.from * 60;

  const timed = events
    .filter((event) => event.start !== null)
    .map((event) => {
      const start = minutesOf(event.start as string);
      // A zero-length window would draw as a hairline; give it a legible floor.
      const length = Math.max(event.minutes ?? 0, 30);
      return { event, start, end: start + length };
    })
    .sort((a, b) => a.start - b.start || b.end - a.end);

  const placed: PlacedEvent[] = [];
  let cluster: typeof timed = [];
  let clusterEnd = -1;

  function flush() {
    if (cluster.length === 0) return;
    // Greedy: an event takes the first lane whose previous occupant has ended.
    const laneEnds: number[] = [];
    const assigned = cluster.map((slot) => {
      let lane = laneEnds.findIndex((end) => end <= slot.start);
      if (lane === -1) lane = laneEnds.length;
      laneEnds[lane] = slot.end;
      return { slot, lane };
    });

    for (const { slot, lane } of assigned) {
      placed.push({
        event: slot.event,
        top: ((slot.start - offset) / span) * 100,
        height: ((slot.end - slot.start) / span) * 100,
        lane,
        lanes: laneEnds.length,
      });
    }
    cluster = [];
    clusterEnd = -1;
  }

  for (const slot of timed) {
    if (cluster.length > 0 && slot.start >= clusterEnd) flush();
    cluster.push(slot);
    clusterEnd = Math.max(clusterEnd, slot.end);
  }
  flush();

  return placed;
}

/** Whether a lane's owner is rostered on a date. Unassigned is never "off". */
export function laneOnDuty(lane: ScheduleLane, date: string) {
  return lane.staff ? isOnDuty(lane.staff, fromISO(date)) : true;
}

/** One lane's events for one date, in the order they are drawn. */
export function eventsOn(lane: ScheduleLane, date: string) {
  return lane.events.filter((event) => event.date === date);
}
