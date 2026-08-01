"use client";

import { useActionState, useId, useState } from "react";

import { PhotoField } from "@/components/inventory/PhotoField";
import { saveItem } from "@/app/(dashboard)/inventory/actions";
import {
  ITEM_FORM_FIELDS,
  fieldLabel,
  type SaveItemState,
} from "@/lib/inventory/form";
import { CATEGORIES } from "@/lib/inventory/summary";
import type { Category, Item } from "@/types/item";
import { cx } from "@/utils/cx";

const inputClass =
  "h-10 w-full rounded-[10px] border border-border-strong bg-surface px-[13px] text-[13px] font-medium text-text outline-none focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,.16)]";

function chipClass(active: boolean) {
  return cx(
    "inline-flex h-[33px] items-center rounded-full border px-3.5 text-[12.5px] font-semibold",
    active
      ? "border-tint-blue bg-tint-blue text-accent-fg"
      : "border-border-strong bg-surface text-text-2 hover:bg-muted",
  );
}

/**
 * Add or edit an item. `item` absent means add.
 *
 * Only the category and the photo are React state, because they are the only
 * two things the rest of the form reads: the category renames two fields and
 * decides whether the date is a shelf life or a calibration, and the photo has
 * no input of its own to live in. Everything else is left uncontrolled, so the
 * browser keeps it and a failed save redraws with the values it was given.
 */
export function ItemForm({
  item,
  zones,
  cancel,
}: {
  item?: Item;
  zones: string[];
  /** The dismiss control, which differs between the page and the dialog. */
  cancel: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState<SaveItemState, FormData>(
    saveItem.bind(null, item?.id ?? null),
    {},
  );

  const submitted = state.values;
  const [category, setCategory] = useState<Category>(
    (submitted?.category as Category) ?? item?.category ?? "Reagent",
  );
  const errorId = useId();

  // A zone the item already sits in but no other item uses would otherwise be
  // missing from its own picker.
  const zoneOptions =
    item && !zones.includes(item.zone) ? [...zones, item.zone] : zones;

  const initial: Record<string, string> = {
    name: item?.name ?? "",
    id: item?.id ?? "",
    location: item?.location ?? "",
    zone: item?.zone ?? zoneOptions[0] ?? "",
    lot: item?.lot ?? "",
    quantity: item ? String(item.quantity) : "",
    unit: item?.unit ?? "",
    min: item ? String(item.min) : "",
    expiry: item?.expiry ?? "",
    supplier: item?.supplier ?? "",
    notes: item?.notes ?? "",
  };
  const valueOf = (name: string) => submitted?.[name] ?? initial[name] ?? "";

  return (
    <form action={formAction} className="px-[26px] pt-[22px] pb-6">
      <PhotoField initial={submitted?.photo ?? item?.photo} />

      <input type="hidden" name="category" value={category} />

      <fieldset>
        <legend className="text-[10px] font-bold tracking-[0.12em] text-text-4">
          CATEGORY
        </legend>
        <div className="mt-[11px] flex flex-wrap gap-2">
          {CATEGORIES.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={category === option}
              onClick={() => setCategory(option)}
              className={chipClass(category === option)}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      {state.errors?.form ? (
        <p
          role="alert"
          className="mt-5 rounded-[10px] bg-badge-red-bg px-3 py-2.5 text-[12.5px] font-semibold text-badge-red-fg"
        >
          {state.errors.form}
        </p>
      ) : null}

      <div className="mt-6 grid grid-cols-3 gap-x-5 gap-y-[18px]">
        {ITEM_FORM_FIELDS.map((field) => {
          const error = state.errors?.[field.name];
          const describedBy = error ? `${errorId}-${field.name}` : undefined;
          const label = fieldLabel(field, category);

          return (
            <div
              key={field.name}
              className={field.span === 2 ? "col-span-2" : "col-span-1"}
            >
              <label
                htmlFor={`${errorId}-${field.name}-input`}
                className="mb-1.5 block text-[12px] font-semibold text-text-2"
              >
                {label}
              </label>

              {"select" in field && field.select ? (
                <select
                  id={`${errorId}-${field.name}-input`}
                  name={field.name}
                  defaultValue={valueOf(field.name)}
                  className={cx(inputClass, "cursor-pointer")}
                >
                  {zoneOptions.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={`${errorId}-${field.name}-input`}
                  name={field.name}
                  defaultValue={valueOf(field.name)}
                  placeholder={field.placeholder}
                  // Text rather than `type="number"`, as the design draws it;
                  // the value is checked on the server either way.
                  inputMode={
                    "numeric" in field && field.numeric ? "numeric" : undefined
                  }
                  aria-invalid={error ? true : undefined}
                  aria-describedby={describedBy}
                  className={cx(
                    inputClass,
                    error && "border-[#dc2626] focus:border-[#dc2626]",
                  )}
                />
              )}

              {error ? (
                <p
                  id={describedBy}
                  className="mt-1.5 text-[11.5px] font-semibold text-[#dc2626]"
                >
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}

        <div className="col-span-3">
          <label
            htmlFor={`${errorId}-notes-input`}
            className="mb-1.5 block text-[12px] font-semibold text-text-2"
          >
            Handling notes
          </label>
          <textarea
            id={`${errorId}-notes-input`}
            name="notes"
            defaultValue={valueOf("notes")}
            placeholder="Storage conditions, hazard class, handling steps"
            className={cx(inputClass, "min-h-[92px] resize-y py-[11px]")}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2.5 border-t border-border-soft pt-5">
        {cancel}
        <button
          type="submit"
          disabled={pending}
          className="flex h-10 items-center rounded-[10px] bg-[#3b82f6] px-5 text-[13px] font-bold text-white hover:bg-[#2563eb] disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save item"}
        </button>
      </div>
    </form>
  );
}
