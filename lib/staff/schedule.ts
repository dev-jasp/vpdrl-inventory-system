import type { Staff } from "@/types/staff";

/** Column headings for a rota, matching the `days` string order. */
export const DAY_NAMES = ["M", "T", "W", "Th", "F", "S", "Su"] as const;

/**
 * Index into a `days` string for a date. `Date#getDay()` counts from Sunday
 * and the rota counts from Monday, hence the shift.
 */
export function dayIndex(date: Date) {
  return (date.getDay() + 6) % 7;
}

export function isOnDuty(person: Staff, date: Date) {
  return person.days[dayIndex(date)] === "1";
}

/** Everyone rostered on `date`, in staff-list order. */
export function onDuty(staff: Staff[], date: Date) {
  return staff.filter((person) => isOnDuty(person, date));
}
