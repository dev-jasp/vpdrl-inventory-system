import { nameTaken } from "@/lib/suppliers/store";
import type { Supplier } from "@/types/supplier";

/**
 * The supplier form, ported from the design's `supFields`. The grid is two
 * columns wide; `span` is how many of them a field takes.
 *
 * `mono` marks the two readings — a count of days and a percentage — which the
 * table sets in the mono face, so typing them matches reading them back. The
 * contact fields are prose and stay in the sans; a phone number is the one
 * reading this app deliberately leaves in the interface face. See
 * `docs/adr/0001-typography.md`.
 */
export const SUPPLIER_FORM_FIELDS = [
  {
    name: "name",
    label: "Supplier name",
    placeholder: "Supplier name",
    span: 2,
  },
  {
    name: "contact",
    label: "Contact person",
    placeholder: "Full name",
    span: 1,
  },
  {
    name: "email",
    label: "Email",
    placeholder: "name@supplier.com",
    span: 1,
  },
  {
    name: "phone",
    label: "Phone",
    placeholder: "+1 800 000 0000",
    span: 1,
  },
  {
    name: "leadDays",
    label: "Lead time (days)",
    placeholder: "5",
    span: 1,
    numeric: true,
    mono: true,
  },
  {
    name: "onTime",
    label: "On-time delivery (%)",
    placeholder: "95",
    span: 1,
    numeric: true,
    mono: true,
  },
] as const;

export type SupplierFormField = (typeof SUPPLIER_FORM_FIELDS)[number];
export type SupplierFormFieldName = SupplierFormField["name"];

/** What the design opens the add form on, and what a blank field falls back to. */
export const DEFAULT_ON_TIME = 95;
export const DEFAULT_LEAD_DAYS = 5;

/** Enough to catch a typo; anything stricter starts rejecting real addresses. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SupplierFormErrors = Partial<
  Record<SupplierFormFieldName | "form", string>
>;

export type SaveSupplierState = {
  errors?: SupplierFormErrors;
  /** The values as submitted, so a rejected form comes back filled in. */
  values?: Record<string, string>;
};

function text(data: FormData, key: string) {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Read a whole number back off the form.
 *
 * Blank is the design's prefill rather than an error — it opens the add form on
 * 95% and 5 days, so an untouched field means "the usual". A value that was
 * typed and does not survive the round trip is reported instead of being
 * silently clamped: the design's `Math.min(100, Number(x) || 0)` turns a
 * fat-fingered "950" into a perfect 100 and a typo'd "9o" into 0%, and both
 * record something the reader never said about a supplier's reliability.
 */
function count(
  data: FormData,
  key: string,
  fallback: number,
  max?: number,
): number | null {
  const raw = text(data, key);
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0) return null;
  if (max !== undefined && value > max) return null;
  return value;
}

/**
 * Read a supplier back off the form.
 *
 * The name is required, where the design falls back to "Untitled supplier".
 * That fallback is affordable when a name is a label; here it is the identity —
 * `Item.supplier` joins on this exact string — so a blank one would create a
 * record nothing can ever point at, and a second blank one would collide with
 * the first.
 *
 * `previousName` is what the record was called when the form opened, so an edit
 * does not report itself as a duplicate of itself.
 */
export function parseSupplierForm(
  data: FormData,
  previousName?: string,
):
  | { supplier: Supplier; errors?: never }
  | { supplier?: never; errors: SupplierFormErrors } {
  const errors: SupplierFormErrors = {};

  const name = text(data, "name");
  if (!name) errors.name = "Give the supplier a name.";
  else if (nameTaken(name, previousName)) {
    errors.name = "Another supplier is already on record under that name.";
  }

  const email = text(data, "email");
  if (!email) errors.email = "An email address is how they get reached.";
  else if (!EMAIL.test(email)) errors.email = "That is not an email address.";

  const leadDays = count(data, "leadDays", DEFAULT_LEAD_DAYS);
  if (leadDays === null) errors.leadDays = "Whole days, 0 or more.";

  const onTime = count(data, "onTime", DEFAULT_ON_TIME, 100);
  if (onTime === null) errors.onTime = "A whole percentage, 0 to 100.";

  if (leadDays === null || onTime === null || Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    supplier: {
      name,
      // The design's own fallbacks, which are honest here: a supplier with
      // nobody named on it is a switchboard, and the table draws the dash.
      contact: text(data, "contact") || "—",
      email,
      phone: text(data, "phone") || "—",
      onTime,
      leadDays,
    },
  };
}
