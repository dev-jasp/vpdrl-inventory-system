import { TODAY, addDays, isoDate, weekOf } from "@/lib/shared/dates";
import { first, oneOf, type RawSearchParams } from "@/lib/shared/params";
import {
  SCHEDULE_KINDS,
  type ScheduleEvent,
  type ScheduleKind,
} from "@/types/schedule";

export type { RawSearchParams };

/**
 * The calendar's state on the URL, on the same grounds as
 * `lib/inventory/filters.ts`: the sidebar's This week / Unscheduled /
 * Calibrations entries are filters rather than routes, and a day somebody is
 * looking at is a day they can send to somebody else.
 *
 * The param names are ours — the design has no schedule view to inherit any
 * from. See `docs/adr/0004-schedule.md`.
 */

export type ScheduleView = "day" | "week";

/** The owner filter's two reserved values, either side of a staff id. */
export const ANY_OWNER = "All";
export const NO_OWNER = "none";

export type ScheduleQuery = {
  /** ISO date the view is anchored to: the day shown, or a day in the week. */
  date: string;
  view: ScheduleView;
  kind: ScheduleKind | null;
  /** `ANY_OWNER`, `NO_OWNER`, or a `Staff.id`. */
  owner: string;
  /**
   * The backlog: every windowless entry across every date, rather than one
   * day or one week of the calendar. `?when=unscheduled`.
   */
  backlog: boolean;
};

export const DEFAULT_QUERY: ScheduleQuery = {
  date: isoDate(TODAY),
  view: "day",
  kind: null,
  owner: ANY_OWNER,
  backlog: false,
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Anything unrecognised falls back to the default rather than erroring. */
export function parseScheduleQuery(params: RawSearchParams): ScheduleQuery {
  const date = first(params.date) ?? "";
  const kind = first(params.kind);

  return {
    date: ISO_DATE.test(date) ? date : DEFAULT_QUERY.date,
    view: oneOf(first(params.view), ["day", "week"], DEFAULT_QUERY.view),
    kind: SCHEDULE_KINDS.includes(kind as ScheduleKind)
      ? (kind as ScheduleKind)
      : null,
    owner: first(params.owner) || DEFAULT_QUERY.owner,
    backlog: first(params.when) === "unscheduled",
  };
}

/**
 * The calendar URL with `patch` applied. Only what differs from the default is
 * written, so the sidebar's `?view=week` and the header's Week button build the
 * same string — which is what lets `activeChild` resolve one against the other.
 */
export function scheduleHref(
  query: ScheduleQuery,
  patch: Partial<ScheduleQuery> = {},
) {
  const next = { ...query, ...patch };

  const params = new URLSearchParams();
  if (next.date !== DEFAULT_QUERY.date) params.set("date", next.date);
  if (next.view !== DEFAULT_QUERY.view) params.set("view", next.view);
  if (next.backlog) params.set("when", "unscheduled");
  if (next.kind) params.set("kind", next.kind);
  if (next.owner !== DEFAULT_QUERY.owner) params.set("owner", next.owner);

  const search = params.toString();
  return search ? `/schedule?${search}` : "/schedule";
}

/**
 * An entry's form, carrying the calendar state that led to it — the same trick
 * `itemHref` plays, and for the same reason: Cancel and a finished save have to
 * land back on the day somebody opened the form from, not on today.
 */
export function entryHref(query: ScheduleQuery, id: string) {
  const [, search] = scheduleHref(query).split("?");
  const path = `/schedule/${encodeURIComponent(id)}/edit`;
  return search ? `${path}?${search}` : path;
}

export function newEntryHref(query: ScheduleQuery, on?: string) {
  const [, search] = scheduleHref(query, on ? { date: on } : {}).split("?");
  return search ? `/schedule/new?${search}` : "/schedule/new";
}

/** Where the `‹` and `›` controls go: a day at a time, or a week. */
export function stepHref(query: ScheduleQuery, direction: 1 | -1) {
  const days = query.view === "week" ? 7 : 1;
  const moved = addDays(new Date(`${query.date}T00:00:00`), days * direction);
  return scheduleHref(query, { date: isoDate(moved) });
}

/** The span the current view covers, as ISO dates. One day, or seven. */
export function visibleDates(query: ScheduleQuery) {
  const anchor = new Date(`${query.date}T00:00:00`);
  return query.view === "week"
    ? weekOf(anchor).map(isoDate)
    : [isoDate(anchor)];
}

/**
 * The kind and owner filters, which apply in every view. Date is not among
 * them — each view decides its own span through `visibleDates`.
 */
export function matchesFilters(event: ScheduleEvent, query: ScheduleQuery) {
  if (query.kind && event.kind !== query.kind) return false;
  if (query.owner === ANY_OWNER) return true;
  if (query.owner === NO_OWNER) return event.ownerId === null;
  return event.ownerId === query.owner;
}

/** Everything in view: filtered, and inside the dates the view covers. */
export function eventsInView(events: ScheduleEvent[], query: ScheduleQuery) {
  const dates = new Set(visibleDates(query));
  return events.filter(
    (event) => dates.has(event.date) && matchesFilters(event, query),
  );
}

/**
 * The backlog: everything still without a window, whatever its date, oldest
 * first. Derived due dates are excluded — a calibration that has not been
 * booked is not a booking somebody forgot to time, and it already has a home
 * in the all-day band.
 */
export function backlogEvents(events: ScheduleEvent[], query: ScheduleQuery) {
  return events.filter(
    (event) =>
      event.source === "authored" &&
      event.start === null &&
      matchesFilters(event, query),
  );
}
