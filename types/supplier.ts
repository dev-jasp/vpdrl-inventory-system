/**
 * A supplier the lab buys from.
 *
 * There is no id: the design joins items to suppliers on the name string
 * (`Item.supplier`), and the supplier form edits records keyed by the name they
 * had when it opened (`origName`). So the name is the identity here too, and
 * renaming one is the operation that has to carry its items along.
 *
 * That is `saveSupplier` in `app/(dashboard)/suppliers/actions.ts`, which
 * writes the record and calls `renameItemSupplier` for the catalogue. Two
 * consequences of a name being an identity: it is required by the form, where
 * the design falls back to "Untitled supplier", and it has to be unique, which
 * `nameTaken` enforces.
 */
export type Supplier = {
  name: string;
  /** The person the lab actually deals with, not a switchboard. */
  contact: string;
  email: string;
  phone: string;
  /** Share of orders that arrived by the promised date, 0–100. */
  onTime: number;
  /** Typical days from placing an order to it landing on the bench. */
  leadDays: number;
};
