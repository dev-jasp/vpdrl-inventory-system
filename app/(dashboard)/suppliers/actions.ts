"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { renameItemSupplier } from "@/lib/inventory/store";
import {
  SUPPLIER_FORM_FIELDS,
  parseSupplierForm,
  type SaveSupplierState,
} from "@/lib/suppliers/form";
import { findSupplier, upsertSupplier } from "@/lib/suppliers/store";

/**
 * What is worth handing back to a rejected form. Named explicitly rather than
 * echoing the whole submission: React posts its own `$ACTION_*` bookkeeping in
 * the same FormData, and returning that as state gets it serialized back into
 * the next submission's state, which then contains the last one, and so on.
 */
const ECHOED = SUPPLIER_FORM_FIELDS.map((field) => field.name);

/**
 * Save a supplier, new or edited, and go back to the list — which is what the
 * design does when the dialog closes. There are no filters on `/suppliers` to
 * carry back, so there is no `back` to bind.
 *
 * `previousName` is bound by the caller rather than posted, so an edit form
 * cannot be made to overwrite a different supplier by rewriting a hidden field.
 */
export async function saveSupplier(
  previousName: string | null,
  _state: SaveSupplierState,
  data: FormData,
): Promise<SaveSupplierState> {
  const existing = previousName ? findSupplier(previousName) : undefined;
  if (previousName && !existing) {
    return { errors: { form: "That supplier is no longer on record." } };
  }

  const parsed = parseSupplierForm(data, existing?.name);

  // Hand the submission back on failure so the form redraws as it was left.
  const values: Record<string, string> = {};
  for (const key of ECHOED) {
    const value = data.get(key);
    if (typeof value === "string") values[key] = value;
  }

  if (parsed.errors) return { errors: parsed.errors, values };

  upsertSupplier(parsed.supplier, existing?.name);

  // The catalogue holds the supplier's name, not a reference to it, so the
  // rename has to reach the items or they are left behind under the old one.
  if (existing && existing.name !== parsed.supplier.name) {
    renameItemSupplier(existing.name, parsed.supplier.name);
    // Every item row and spec sheet can name a supplier, and the list is
    // filtered by that name from this very table.
    revalidatePath("/inventory");
    revalidatePath("/inventory/[itemId]", "page");
  }

  revalidatePath("/suppliers");

  redirect("/suppliers");
}
