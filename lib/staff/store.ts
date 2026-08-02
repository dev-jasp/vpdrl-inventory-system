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
  return person;
}

/**
 * The next id in the design's `S-NN` shape.
 *
 * Counted from the highest number in use rather than from the list length,
 * which is what the design does: with a list of 14 whose last id is S-14 the
 * two agree, but they stop agreeing the moment anybody is removed, and an id
 * that silently lands on somebody else's record is the one mistake this has to
 * not make.
 */
export function nextStaffId() {
  const highest = staff.reduce((top, person) => {
    const number = Number(/^S-(\d+)$/.exec(person.id)?.[1]);
    return Number.isInteger(number) && number > top ? number : top;
  }, 0);
  return `S-${String(highest + 1).padStart(2, "0")}`;
}
