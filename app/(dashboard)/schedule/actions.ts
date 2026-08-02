"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { allItems } from "@/lib/inventory/store";
import {
  SCHEDULE_FORM_FIELDS,
  parseScheduleForm,
  type SaveScheduleState,
} from "@/lib/schedule/form";
import { findEntry, nextEntryId, upsertEntry } from "@/lib/schedule/store";

/**
 * What is worth handing back to a rejected form. Named explicitly rather than
 * echoing the whole submission, for the reason `ECHOED` in the suppliers
 * action gives: React posts its own `$ACTION_*` bookkeeping in the same
 * FormData, and returning that as state compounds it on every submission.
 */
const ECHOED: readonly string[] = SCHEDULE_FORM_FIELDS;

/**
 * Save a schedule entry, new or edited, and land back on the calendar the form
 * was opened from — `back` carries the day, the view and the filters, so a
 * save from Thursday's grid does not drop you on today.
 *
 * `id` and `back` are bound by the caller rather than posted: an edit form must
 * not be able to overwrite a different entry, or redirect somewhere else, by
 * rewriting a hidden field.
 */
export async function saveScheduleEntry(
  id: string | null,
  back: string,
  _state: SaveScheduleState,
  data: FormData,
): Promise<SaveScheduleState> {
  const existing = id ? findEntry(id) : undefined;
  if (id && !existing) {
    return { errors: { form: "That entry is no longer on the calendar." } };
  }

  const items = allItems();
  const parsed = parseScheduleForm(
    data,
    existing?.id ?? nextEntryId(),
    new Set(items.map((item) => item.id)),
  );

  // Hand the submission back on failure so the form redraws as it was left.
  const values: Record<string, string> = {};
  for (const key of ECHOED) {
    const value = data.get(key);
    if (typeof value === "string") values[key] = value;
  }

  if (parsed.errors) return { errors: parsed.errors, values };

  upsertEntry(parsed.entry);

  revalidatePath("/schedule");
  // A calibration booking changes how the item's due date reads — "Booked"
  // rather than "Cal. Due" — and the due date is drawn from the item page too.
  if (parsed.entry.kind === "CAL" && parsed.entry.itemId) {
    revalidatePath("/inventory/[itemId]", "page");
  }

  redirect(back);
}
