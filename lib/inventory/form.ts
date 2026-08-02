import type { Category, ExpiryKind, Item } from "@/types/item";
import { CATEGORIES } from "./summary";

/**
 * The item form, ported from the design's `fields`. The grid is three columns
 * wide; `span` is how many of them a field takes.
 *
 * Two labels change with the category, because a calibrated instrument is
 * identified by a serial number and dated by a calibration due date, where
 * everything else has a lot number and a shelf life. That is the same
 * distinction `expiryKind` carries on the item itself.
 *
 * `mono` marks the fields holding a code, a date or a count — the ones the UI
 * sets in the mono face wherever it reads them back, so typing them matches.
 * It is not the same as `numeric`, which is about the phone keypad: a lot
 * number is mono but not numeric.
 */
export const ITEM_FORM_FIELDS = [
  {
    name: "name",
    label: "Item name",
    placeholder: "e.g. Tris base, 1 kg",
    span: 2,
  },
  { name: "id", label: "Item ID", placeholder: "RG-0000", span: 1, mono: true },
  {
    name: "location",
    label: "Storage location",
    placeholder: "Bay A · Shelf 2",
    span: 1,
  },
  { name: "zone", label: "Zone", placeholder: "Bay A", span: 1, select: true },
  {
    name: "lot",
    label: "Lot number",
    calibrationLabel: "Serial number",
    placeholder: "LOT-0000",
    span: 1,
    mono: true,
  },
  {
    name: "quantity",
    label: "Quantity on hand",
    placeholder: "0",
    span: 1,
    numeric: true,
    mono: true,
  },
  { name: "unit", label: "Unit", placeholder: "vial", span: 1 },
  {
    name: "min",
    label: "Reorder at",
    placeholder: "0",
    span: 1,
    numeric: true,
    mono: true,
  },
  {
    name: "expiry",
    label: "Expiry date",
    calibrationLabel: "Calibration due",
    placeholder: "YYYY-MM-DD",
    span: 1,
    mono: true,
  },
  {
    name: "supplier",
    label: "Supplier",
    placeholder: "Supplier name",
    span: 2,
  },
] as const;

export type ItemFormField = (typeof ITEM_FORM_FIELDS)[number];
export type ItemFormFieldName = ItemFormField["name"];

export function fieldLabel(field: ItemFormField, category: Category) {
  return "calibrationLabel" in field && category === "Equipment"
    ? field.calibrationLabel
    : field.label;
}

/** Equipment is calibrated; everything else has a shelf life. */
export function expiryKindOf(category: Category): ExpiryKind {
  return category === "Equipment" ? "CAL" : "EXP";
}

export type ItemFormErrors = Partial<
  Record<ItemFormFieldName | "form", string>
>;

export type SaveItemState = {
  errors?: ItemFormErrors;
  /** The values as submitted, so a rejected form comes back filled in. */
  values?: Record<string, string>;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function text(data: FormData, key: string) {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * A number that must be a whole count of things. Blank reads as 0, which is
 * what the design's `Number(fm.qty) || 0` does; anything non-numeric or
 * negative is an error rather than a silent zero.
 */
function count(raw: string) {
  if (raw === "") return 0;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) return null;
  return value;
}

/** A fresh id in the design's shape, for a new item saved without one. */
function generatedId() {
  return `NEW-${1000 + Math.floor(Math.random() * 8999)}`;
}

/**
 * Read an item back off the form.
 *
 * The design substitutes defaults for everything it finds blank — an unnamed
 * item is saved as "Untitled item". That is fine for a mockup and poor for a
 * record somebody has to find again, so the fields that make an item
 * identifiable or countable are required here and the rest keep the design's
 * fallbacks. An id left blank on a new item is still generated, which is a
 * feature rather than a substitution.
 */
export function parseItemForm(
  data: FormData,
  existing?: Item,
): { item: Item; errors?: never } | { item?: never; errors: ItemFormErrors } {
  const errors: ItemFormErrors = {};

  const rawCategory = text(data, "category");
  const category = (
    CATEGORIES.includes(rawCategory as Category) ? rawCategory : "Reagent"
  ) as Category;

  const name = text(data, "name");
  if (!name) errors.name = "Give the item a name.";

  // An edit keeps its own id; a new item takes what was typed, or is given
  // one. Whether that id is free is the store's question, not the form's.
  const id = existing?.id || text(data, "id") || generatedId();

  const unit = text(data, "unit");
  if (!unit) errors.unit = "Give the quantity a unit.";

  const quantity = count(text(data, "quantity"));
  if (quantity === null) errors.quantity = "Must be a number, 0 or more.";

  const min = count(text(data, "min"));
  if (min === null) errors.min = "Must be a number, 0 or more.";

  const expiry = text(data, "expiry");
  if (expiry && !ISO_DATE.test(expiry)) {
    errors.expiry = "Use YYYY-MM-DD.";
  } else if (expiry && Number.isNaN(new Date(`${expiry}T00:00:00`).getTime())) {
    errors.expiry = "That is not a real date.";
  }

  if (Object.keys(errors).length > 0) return { errors };

  const photo = text(data, "photo");
  const notes = text(data, "notes");

  return {
    item: {
      id,
      name,
      category,
      location: text(data, "location") || "Unassigned",
      quantity: quantity as number,
      unit,
      min: min as number,
      expiry: expiry || null,
      expiryKind: expiryKindOf(category),
      lot: text(data, "lot") || "—",
      supplier: text(data, "supplier") || "—",
      zone: text(data, "zone") || "Bay A",
      ...(photo ? { photo } : {}),
      ...(notes ? { notes } : {}),
    },
  };
}
