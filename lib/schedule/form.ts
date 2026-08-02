import { oneOf } from "@/lib/shared/params";
import {
  ENTRY_STATUSES,
  SCHEDULE_KINDS,
  type EntryStatus,
  type ScheduleEntry,
  type ScheduleKind,
} from "@/types/schedule";

/**
 * Reading a schedule entry back off the form.
 *
 * The one rule with teeth is on calibrations: a `CAL` entry must name an item
 * that exists. A booking whose `itemId` points at nothing is a booking that
 * can never be matched to the due date it was made to satisfy, and the due
 * date would go on reading as unbooked while an appointment sat in somebody's
 * column — the two facts silently disagreeing, which is the exact failure the
 * split between them was drawn to avoid.
 */

/** The windows a lab actually books, in minutes. */
export const DURATIONS = [30, 45, 60, 90, 120, 180, 240];

export const DEFAULT_DURATION = 60;

export type ScheduleFormErrors = Partial<
  Record<"title" | "date" | "start" | "itemId" | "form", string>
>;

export type SaveScheduleState = {
  errors?: ScheduleFormErrors;
  /** The values as submitted, so a rejected form comes back filled in. */
  values?: Record<string, string>;
};

/** Every field echoed back to a rejected form — see `ECHOED` in the action. */
export const SCHEDULE_FORM_FIELDS = [
  "kind",
  "title",
  "date",
  "start",
  "minutes",
  "ownerId",
  "supplier",
  "reference",
  "itemId",
  "note",
  "status",
] as const;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

function text(data: FormData, key: string) {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function parseScheduleForm(
  data: FormData,
  id: string,
  /** Item ids in the catalogue, for checking a calibration booking's target. */
  itemIds: Set<string>,
):
  | { entry: ScheduleEntry; errors?: never }
  | { entry?: never; errors: ScheduleFormErrors } {
  const errors: ScheduleFormErrors = {};

  const title = text(data, "title");
  if (!title) errors.title = "Give it a name somebody will recognise.";

  const date = text(data, "date");
  if (!date) errors.date = "Every entry sits on a date.";
  else if (!ISO_DATE.test(date)) errors.date = "That is not a date.";

  const rawStart = text(data, "start");
  if (rawStart && !TIME.test(rawStart)) {
    errors.start = "Use a 24-hour time, like 09:30.";
  }

  const kind = oneOf(text(data, "kind"), SCHEDULE_KINDS, "MTG");
  const itemId = text(data, "itemId");
  if (kind === "CAL") {
    if (!itemId) errors.itemId = "A calibration books a specific instrument.";
    else if (!itemIds.has(itemId)) {
      errors.itemId = `No item ${itemId} in the catalogue.`;
    }
  }

  if (Object.keys(errors).length > 0) return { errors };

  // A window is a start *and* a length; without a start there is neither, and
  // the entry stays in the all-day band where it can be found and pinned.
  const start = rawStart || null;
  const minutes = start
    ? oneOf(
        text(data, "minutes"),
        DURATIONS.map(String),
        String(DEFAULT_DURATION),
      )
    : null;

  return {
    entry: {
      id,
      kind,
      title,
      date,
      start,
      minutes: minutes ? Number(minutes) : null,
      ownerId: text(data, "ownerId") || null,
      supplier: text(data, "supplier") || null,
      reference: text(data, "reference") || null,
      // Only a calibration carries one; a delivery's paperwork is `reference`.
      itemId: kind === "CAL" ? itemId : null,
      ...(text(data, "note") ? { note: text(data, "note") } : {}),
      status: oneOf<EntryStatus>(
        text(data, "status"),
        ENTRY_STATUSES,
        "Tentative",
      ),
    },
  };
}

/** The kind a new entry opens on, and the one the sidebar's filters imply. */
export function defaultKind(kind: ScheduleKind | null): ScheduleKind {
  return kind ?? "MTG";
}
