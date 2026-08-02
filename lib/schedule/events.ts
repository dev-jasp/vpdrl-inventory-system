import { daysUntil } from "@/lib/inventory/status";
import { fromISO, isoDate, shortDate } from "@/lib/shared/dates";
import type { Item } from "@/types/item";
import type {
  EntryStatus,
  ScheduleEntry,
  ScheduleEvent,
  Tone,
} from "@/types/schedule";

/**
 * Turning what the lab knows into what the calendar draws.
 *
 * Two sources meet here and only here. Calibration due dates are **projected**
 * from the item catalogue — `Item.expiry` where `expiryKind` is `CAL` — and
 * are never copied into the schedule store, so a due date and the `Cal.
 * Overdue` badge on `/inventory` cannot drift apart. Everything else is an
 * authored `ScheduleEntry`.
 *
 * A calibration *booking* is an authored entry carrying `itemId`. It does not
 * replace the projected due date; it sits beside it, and the due date learns
 * it has been booked. Two facts about one instrument, each owned once. See
 * `docs/adr/0004-schedule.md`.
 */

/** `"09:30"` as minutes past midnight, for anything that has to sort or size. */
export function minutesOf(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/** Minutes past midnight back as `"09:30"`. */
export function timeOf(minutes: number) {
  const hours = Math.floor(minutes / 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

/**
 * An hour as the grid's gutter names it — `8am`, `12pm`, `5pm`.
 *
 * The one place in the app that writes a clock in 12-hour form, because it is
 * the one place a clock is not a reading. Nobody compares two gutter labels to
 * each other; they use them to find which row an hour is in, and `8am` is a
 * shorter thing to land on than `08:00`. Windows on the cards stay 24-hour,
 * where they are being compared.
 */
export function hourLabel(hour: number) {
  const clock = hour % 24;
  return `${clock % 12 === 0 ? 12 : clock % 12}${clock < 12 ? "am" : "pm"}`;
}

/**
 * The window an event occupies, written the way the rest of the app writes a
 * reading — 24-hour, mono, and an arrow rather than a dash so it survives
 * being read next to a hyphenated reference like `PO-2026-014`.
 */
export function windowLabel(event: ScheduleEvent) {
  if (!event.start) return null;
  const end = timeOf(minutesOf(event.start) + (event.minutes ?? 0));
  return `${event.start} → ${end}`;
}

const ENTRY_TONES: Record<EntryStatus, Tone> = {
  Tentative: "amber",
  Confirmed: "blue",
  Done: "green",
  Cancelled: "muted",
};

/** Whether an entry books a calibration that is still standing. */
function booksCalibration(entry: ScheduleEntry) {
  return (
    entry.kind === "CAL" && entry.itemId !== null && entry.status !== "Cancelled"
  );
}

/**
 * An authored entry as the calendar draws it.
 *
 * An entry with no window reads as **Unscheduled** whatever its stored status
 * says, because that is the more urgent fact about it: a confirmed delivery
 * with no hour still needs an hour.
 */
export function entryEvent(
  entry: ScheduleEntry,
  entryHref: (id: string) => string,
): ScheduleEvent {
  const unscheduled = entry.start === null;
  const subtitle =
    [entry.supplier, entry.reference].filter(Boolean).join(" · ") || null;

  return {
    id: entry.id,
    kind: entry.kind,
    source: "authored",
    title: entry.title,
    subtitle,
    date: entry.date,
    start: entry.start,
    minutes: entry.minutes,
    ownerId: entry.ownerId,
    status: unscheduled ? "Unscheduled" : entry.status,
    tone: unscheduled ? "violet" : ENTRY_TONES[entry.status],
    itemId: entry.itemId,
    bookingId: null,
    href: entryHref(entry.id),
  };
}

/**
 * Calibration due dates projected off the catalogue.
 *
 * An overdue calibration that nobody has booked is drawn on **today** rather
 * than on the date it lapsed. A deadline three weeks gone is still outstanding
 * work, and leaving it on its own date means the only way to find it is to
 * page backwards to a week nobody has a reason to look at. Booked ones stay
 * put: the booking is where the work now lives, and the due date's job is
 * finished once it points at one.
 */
export function calibrationEvents(
  items: Item[],
  entries: ScheduleEntry[],
  on: Date,
): ScheduleEvent[] {
  const bookings = new Map(
    entries
      .filter(booksCalibration)
      .map((entry) => [entry.itemId as string, entry]),
  );
  const todayISO = isoDate(on);

  return items
    .filter((item) => item.expiryKind === "CAL" && item.expiry)
    .map((item) => {
      const due = item.expiry as string;
      const days = daysUntil(due, on) ?? 0;
      const booking = bookings.get(item.id);
      const overdue = days < 0;

      const status = booking
        ? "Booked"
        : overdue
          ? "Cal. Overdue"
          : days <= 30
            ? "Cal. Due"
            : "Scheduled";

      const tone: Tone = booking
        ? "green"
        : overdue
          ? "red"
          : days <= 30
            ? "amber"
            : "muted";

      // Only an unbooked lapsed date moves; everything else sits on its date.
      const carried = overdue && !booking;

      return {
        id: `cal:${item.id}`,
        kind: "CAL" as const,
        source: "derived" as const,
        title: item.name,
        // What the reader needs beside the title differs by state: a lapsed
        // date drawn on today has to say what date it actually was, and a
        // booked one has to say when the work is happening. Only a due date
        // sitting quietly on its own day has room to name the zone.
        subtitle: booking
          ? `${item.id} · booked ${shortDate(fromISO(booking.date))}`
          : carried
            ? `${item.id} · due ${shortDate(fromISO(due))}`
            : `${item.id} · ${item.zone}`,
        date: carried ? todayISO : due,
        start: null,
        minutes: null,
        ownerId: null,
        status,
        tone,
        itemId: item.id,
        bookingId: booking?.id ?? null,
        href: `/inventory/${encodeURIComponent(item.id)}`,
      };
    });
}

/**
 * Everything the calendar can draw, in one list.
 *
 * Sorted by date then by start, with windowless events first inside a day —
 * the all-day band is drawn above the grid, so the order here is already the
 * order they appear in.
 */
export function scheduleEvents(
  items: Item[],
  entries: ScheduleEntry[],
  on: Date,
  entryHref: (id: string) => string,
): ScheduleEvent[] {
  const events = [
    ...calibrationEvents(items, entries, on),
    ...entries.map((entry) => entryEvent(entry, entryHref)),
  ];

  return events.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1;
    if (a.start === b.start) return a.title.localeCompare(b.title);
    if (!a.start) return -1;
    if (!b.start) return 1;
    return minutesOf(a.start) - minutesOf(b.start);
  });
}

/** The events with a window, which is what the hour grid draws. */
export function timed(events: ScheduleEvent[]) {
  return events.filter((event) => event.start !== null);
}

/** The events without one, which is what the all-day band draws. */
export function untimed(events: ScheduleEvent[]) {
  return events.filter((event) => event.start === null);
}
