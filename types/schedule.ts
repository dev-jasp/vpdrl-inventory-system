/**
 * The lab's dated work: calibrations coming due, consignments arriving, and
 * the meetings and paper follow-ups with suppliers that neither of the other
 * two ever quite covers.
 *
 * Two shapes live here, and the distinction between them is the whole design.
 * A `ScheduleEntry` is a record somebody wrote — it is stored, edited and
 * deleted. A `ScheduleEvent` is what the calendar draws, and it comes from
 * either an entry or a projection over the catalogue. See
 * `docs/adr/0004-schedule.md`.
 */

/** What sort of dated work this is. The three the lab actually tracks. */
export type ScheduleKind = "CAL" | "DEL" | "MTG";

export const SCHEDULE_KINDS: ScheduleKind[] = ["CAL", "DEL", "MTG"];

/** The kind spoken as somebody would say it. */
export const KIND_LABELS: Record<ScheduleKind, string> = {
  CAL: "Calibration",
  DEL: "Delivery",
  MTG: "Meeting",
};

export type EntryStatus = "Tentative" | "Confirmed" | "Done" | "Cancelled";

export const ENTRY_STATUSES: EntryStatus[] = [
  "Tentative",
  "Confirmed",
  "Done",
  "Cancelled",
];

/**
 * An authored record: a supplier meeting, an expected consignment, or a
 * booking to perform a calibration.
 *
 * `start` and `minutes` are nullable together, and that is the pivot the whole
 * page turns on. An entry with no window is **unscheduled** — it is known to
 * be happening on a date but not yet at an hour, which is the honest state of
 * a delivery a supplier has only promised for "sometime Tuesday". Pinning a
 * window promotes it out of the all-day band and into somebody's column.
 */
export type ScheduleEntry = {
  id: string;
  kind: ScheduleKind;
  title: string;
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  /** `HH:MM`, 24-hour, or null while the window is unknown. */
  start: string | null;
  /** Length of the window in minutes; null alongside a null `start`. */
  minutes: number | null;
  /** `Staff.id`, or null while nobody owns it. */
  ownerId: string | null;
  /** Joined by name, as `Item.supplier` is — see `types/supplier.ts`. */
  supplier: string | null;
  /**
   * Whatever paperwork this hangs off — "PO-2026-014", "RFQ-118". Free text
   * rather than a reference, because there is no purchase order record to
   * point at yet; `docs/structure.md` marks that as the seam.
   */
  reference: string | null;
  /**
   * The item a calibration booking is for. Set on `kind: "CAL"` entries only,
   * and it is what links a booking back to the due date it satisfies —
   * `Item.expiry` stays the deadline, this record is the appointment.
   */
  itemId: string | null;
  note?: string;
  status: EntryStatus;
};

/** Which badge palette a card wears. Keys of the `--badge-*` token families. */
export type Tone = "green" | "amber" | "red" | "violet" | "blue" | "muted";

/**
 * Where an event came from. `derived` events are projected from the item
 * catalogue and cannot be edited here; `authored` ones are entries.
 */
export type ScheduleSource = "derived" | "authored";

/** One thing drawn on the calendar, whatever it was built from. */
export type ScheduleEvent = {
  /** The entry's id, or `cal:EQ-3010` for a projected due date. */
  id: string;
  kind: ScheduleKind;
  source: ScheduleSource;
  title: string;
  /** The line under the title — supplier, reference, location. */
  subtitle: string | null;
  /** The date this event is drawn on, which is not always its due date. */
  date: string;
  start: string | null;
  minutes: number | null;
  ownerId: string | null;
  /** The pill: "Confirmed", "Cal. Overdue", "Unscheduled". */
  status: string;
  tone: Tone;
  /** The item this concerns, on a projected due date or a booking. */
  itemId: string | null;
  /** The entry that books this projected due date, when one exists. */
  bookingId: string | null;
  /** Where the card goes when clicked, or null when it goes nowhere. */
  href: string | null;
};
