import { SCHEDULE } from "@/data/schedule";
import type { ScheduleEntry } from "@/types/schedule";

/**
 * The authored half of the schedule, standing in for the API exactly as
 * `lib/inventory/store.ts` does for items: module state, alive as long as the
 * server process, reset on restart.
 *
 * Only *authored* entries live here. Calibration due dates are projected from
 * the item store and never written into this one — see `lib/schedule/events.ts`
 * and `docs/adr/0004-schedule.md`.
 */
let entries: ScheduleEntry[] = SCHEDULE.map((entry) => ({ ...entry }));

export function allEntries(): ScheduleEntry[] {
  return entries;
}

export function findEntry(id: string) {
  return entries.find((entry) => entry.id === id);
}

export function upsertEntry(entry: ScheduleEntry) {
  const index = entries.findIndex((existing) => existing.id === entry.id);
  entries =
    index >= 0
      ? entries.map((existing, at) => (at === index ? entry : existing))
      : [...entries, entry];
  return entry;
}

export function removeEntry(id: string) {
  const before = entries.length;
  entries = entries.filter((entry) => entry.id !== id);
  return entries.length < before;
}

/**
 * The next id in the seed's `SC-NN` shape, counted from the highest number in
 * use rather than from the list length — `nextStaffId` in `lib/staff/store.ts`
 * carries the reasoning.
 */
export function nextEntryId() {
  const highest = entries.reduce((top, entry) => {
    const number = Number(/^SC-(\d+)$/.exec(entry.id)?.[1]);
    return Number.isInteger(number) && number > top ? number : top;
  }, 0);
  return `SC-${String(highest + 1).padStart(2, "0")}`;
}
