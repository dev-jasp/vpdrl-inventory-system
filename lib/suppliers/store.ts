import { SUPPLIERS } from "@/data/suppliers";
import type { Supplier } from "@/types/supplier";

/**
 * The supplier collection, standing in for the API exactly as
 * `lib/inventory/store.ts` does for items: module state, alive as long as the
 * server process, reset on restart. This module is the one seam to replace
 * when there is a backend.
 */
let suppliers: Supplier[] = SUPPLIERS.map((supplier) => ({ ...supplier }));

export function allSuppliers(): Supplier[] {
  return suppliers;
}

/**
 * Suppliers are keyed by name — see `types/supplier.ts`. Matching is exact,
 * because that string is the join to `Item.supplier`.
 */
export function findSupplier(name: string) {
  return suppliers.find((supplier) => supplier.name === name);
}

/**
 * Is this name already taken by somebody other than `except`?
 *
 * Compared case-insensitively, which is stricter than the join needs. "VWR"
 * and "vwr" are two different join keys and would sit in the table as two
 * separate rows, each holding part of the same supplier's catalogue — legal,
 * and never what anybody meant.
 */
export function nameTaken(name: string, except?: string) {
  const wanted = name.toLowerCase();
  return suppliers.some(
    (supplier) =>
      supplier.name !== except && supplier.name.toLowerCase() === wanted,
  );
}

/**
 * Save a supplier, new or edited.
 *
 * `previousName` is what the record was called when the form opened, which is
 * how an edit finds the row to replace when the name itself is what changed. A
 * rename keeps its position in the list rather than jumping to the end — the
 * table sorts by item count anyway, and a record that moves for reasons the
 * reader cannot see is a record they lose.
 *
 * The catalogue is not this module's to update: `Item.supplier` holds the same
 * name, and carrying it across a rename is `renameItemSupplier` in
 * `lib/inventory/store.ts`. The action calls both.
 */
export function upsertSupplier(supplier: Supplier, previousName?: string) {
  const index = suppliers.findIndex(
    (existing) => existing.name === (previousName ?? supplier.name),
  );
  suppliers =
    index >= 0
      ? suppliers.map((existing, at) => (at === index ? supplier : existing))
      : [...suppliers, supplier];
  return supplier;
}
