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
