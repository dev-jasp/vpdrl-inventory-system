"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  ITEM_FORM_FIELDS,
  parseItemForm,
  type SaveItemState,
} from "@/lib/inventory/form";
import { findItem, upsertItem } from "@/lib/inventory/store";

/**
 * What is worth handing back to a rejected form. Named explicitly rather than
 * echoing the whole submission: React posts its own `$ACTION_*` bookkeeping in
 * the same FormData, and returning that as state gets it serialized back into
 * the next submission's state, which then contains the last one, and so on.
 */
const ECHOED = [
  ...ITEM_FORM_FIELDS.map((field) => field.name),
  "category",
  "notes",
  "photo",
];

/**
 * Save an item, new or edited, and land on its detail page.
 *
 * `itemId` is bound by the caller rather than posted, so an edit form cannot
 * be made to overwrite a different item by rewriting a hidden field.
 */
export async function saveItem(
  itemId: string | null,
  _previous: SaveItemState,
  data: FormData,
): Promise<SaveItemState> {
  const existing = itemId ? findItem(itemId) : undefined;
  if (itemId && !existing) {
    return { errors: { form: "That item no longer exists." } };
  }

  const parsed = parseItemForm(data, existing);

  // Hand the submission back on failure so the form redraws as it was left,
  // photo and category included — neither survives a re-render on its own.
  const values: Record<string, string> = {};
  for (const key of ECHOED) {
    const value = data.get(key);
    if (typeof value === "string") values[key] = value;
  }

  if (parsed.errors) return { errors: parsed.errors, values };

  if (!existing && findItem(parsed.item.id)) {
    return {
      errors: { id: "That item ID is already in use." },
      values,
    };
  }

  upsertItem(parsed.item);

  // The dashboard, the list and this item's own page all read the store.
  revalidatePath("/");
  revalidatePath("/inventory");
  revalidatePath(`/inventory/${parsed.item.id}`);

  redirect(`/inventory/${encodeURIComponent(parsed.item.id)}`);
}
