/**
 * The date every seed dataset in `data/` is written against — the same one the
 * design pins (`today = new Date("2026-07-29T00:00:00")`). Views read this
 * rather than `new Date()` for two reasons: the seed expiry and calibration
 * dates only make sense relative to it, and a statically prerendered page that
 * called `new Date()` would freeze whatever date the build ran on.
 *
 * Delete this the day `data/` is replaced by a real API.
 */
export const TODAY = new Date("2026-07-29T00:00:00");

/**
 * The zone every wall-clock time in the app is written in.
 *
 * Nothing here converts between zones — `isoDate` and every `start` in
 * `data/schedule.ts` are local wall clock, and the lab is one building. But a
 * grid of hours with no zone against it quietly claims to be in *your* hours,
 * so the schedule's gutter names this one. A label, not a calculation: change
 * it here the day the lab moves.
 */
export const TIME_ZONE_LABEL = "GMT+8";

/**
 * A date written out — "29 July 2026". The locale is pinned rather than left to
 * the runtime for the same reason `peso` pins its own: the server and the
 * browser must not disagree and trip hydration.
 */
const longFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function longDate(date: Date) {
  return longFormat.format(date);
}

/**
 * The same date short — "18 Jul". For places that name a date inside a line
 * of other text, where the year is either obvious or beside the point.
 */
const shortFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
});

export function shortDate(date: Date) {
  return shortFormat.format(date);
}

/**
 * A date as `YYYY-MM-DD` in **local** time.
 *
 * Not `toISOString().slice(0, 10)`, which converts to UTC first: east of
 * Greenwich that hands back yesterday for every date before the offset, so a
 * calendar built on it draws Monday's work on Sunday. Every seed date in
 * `data/` is a local wall-clock date and is read back as one.
 */
export function isoDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** The inverse: a `YYYY-MM-DD` string as local midnight. */
export function fromISO(date: string) {
  return new Date(`${date}T00:00:00`);
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/**
 * The Monday of the week `date` falls in. Monday-first because that is the
 * order `Staff.days` is written in — see `lib/staff/schedule.ts`.
 */
export function startOfWeek(date: Date) {
  return addDays(date, -((date.getDay() + 6) % 7));
}

/** The seven days of `date`'s week, Monday first. */
export function weekOf(date: Date) {
  const monday = startOfWeek(date);
  return Array.from({ length: 7 }, (_, offset) => addDays(monday, offset));
}

