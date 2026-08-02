import { STAFF } from "@/data/staff";
import type { Staff } from "@/types/staff";

/**
 * The staff collection, standing in for the API exactly as
 * `lib/inventory/store.ts` does for items: module state, alive as long as the
 * server process, reset on restart. A saved colleague survives a navigation
 * and a refresh but not a rebuild, which is the honest limit of a repo with no
 * backend, and this module is the one seam to replace when there is one.
 */
let staff: Staff[] = STAFF.map((person) => ({ ...person }));

/** The number part of an `S-NN` id, or 0 for anything not in that shape. */
function idNumber(id: string) {
  const parsed = Number(/^S-(\d+)$/.exec(id)?.[1]);
  return Number.isInteger(parsed) ? parsed : 0;
}

/**
 * The highest id ever handed out, which is not the same as the highest in the
 * list once somebody can be removed. Only ever climbs — see `nextStaffId`.
 */
let highestIssued = staff.reduce(
  (top, person) => Math.max(top, idNumber(person.id)),
  0,
);

export function allStaff(): Staff[] {
  return staff;
}

export function findStaff(id: string) {
  return staff.find((person) => person.id === id);
}

/** New people join the end of the list, as they do in the design. */
export function upsertStaff(person: Staff) {
  const index = staff.findIndex((existing) => existing.id === person.id);
  staff =
    index >= 0
      ? staff.map((existing, at) => (at === index ? person : existing))
      : [...staff, person];
  highestIssued = Math.max(highestIssued, idNumber(person.id));
  return person;
}

/**
 * Take somebody off the list. Reports whether there was anybody to take off, so
 * a delete arriving twice is a message rather than a silent success.
 *
 * `highestIssued` deliberately does not come down with them: their id is spent,
 * not returned to the pool.
 */
export function removeStaff(id: string) {
  const before = staff.length;
  staff = staff.filter((person) => person.id !== id);
  return staff.length < before;
}

/**
 * The next id in the design's `S-NN` shape.
 *
 * Counted from the highest ever issued rather than from the list length or from
 * the highest still in it. The design counts the length, which agrees with the
 * ids right up until somebody is removed; counting the survivors agrees for
 * longer but breaks the same way, because deleting S-14 from a list of 14 makes
 * S-14 the next id out. Either way a new hire inherits a departed colleague's
 * id, and every record that pointed at the old one — a rota, an assigned zone —
 * silently points at the new one. That is the one mistake this has to not make,
 * so the counter only ever climbs.
 */
export function nextStaffId() {
  return `S-${String(highestIssued + 1).padStart(2, "0")}`;
}
