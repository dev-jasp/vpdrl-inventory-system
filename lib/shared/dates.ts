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
