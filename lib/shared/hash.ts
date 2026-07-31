/**
 * FNV-1a, ported from the design. Used to pick a stable presentational detail
 * — an avatar tint, say — from an id, so the same person keeps the same colour
 * across renders, routes and machines without storing one.
 */
export function hash(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}
