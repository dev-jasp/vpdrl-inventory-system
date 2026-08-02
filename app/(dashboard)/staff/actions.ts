"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  STAFF_FORM_FIELDS,
  parseStaffForm,
  type SaveStaffState,
} from "@/lib/staff/form";
import { findStaff, nextStaffId, upsertStaff } from "@/lib/staff/store";

/**
 * What is worth handing back to a rejected form. Named explicitly rather than
 * echoing the whole submission: React posts its own `$ACTION_*` bookkeeping in
 * the same FormData, and returning that as state gets it serialized back into
 * the next submission's state, which then contains the last one, and so on.
 */
const ECHOED = [
  ...STAFF_FORM_FIELDS.map((field) => field.name),
  "group",
  "employment",
  "days",
  "photo",
];

/**
 * Save a person, new or edited, and go back to the list the form was opened
 * from — which is what the design does when the dialog closes.
 *
 * Both `staffId` and `back` are bound by the caller rather than posted, so an
 * edit form cannot be made to overwrite somebody else by rewriting a hidden
 * field. `back` is checked all the same: a redirect target is worth being sure
 * about even when it arrives sealed.
 */
export async function saveStaff(
  staffId: string | null,
  back: string,
  _previous: SaveStaffState,
  data: FormData,
): Promise<SaveStaffState> {
  const existing = staffId ? findStaff(staffId) : undefined;
  if (staffId && !existing) {
    return { errors: { form: "That staff record no longer exists." } };
  }

  const parsed = parseStaffForm(data, existing?.id ?? nextStaffId());

  // Hand the submission back on failure so the form redraws as it was left,
  // photo and chips included — none of them survives a re-render on its own.
  const values: Record<string, string> = {};
  for (const key of ECHOED) {
    const value = data.get(key);
    if (typeof value === "string") values[key] = value;
  }

  if (parsed.errors) return { errors: parsed.errors, values };

  upsertStaff(parsed.staff);

  // The dashboard's on-duty row, the list, and this person's own profile all
  // read the store.
  revalidatePath("/");
  revalidatePath("/staff");
  revalidatePath(`/staff/${parsed.staff.id}`);

  redirect(back.startsWith("/staff") ? back : "/staff");
}
