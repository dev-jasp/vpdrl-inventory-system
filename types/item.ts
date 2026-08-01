export type Category =
  "Reagent" | "Solvent" | "Consumable" | "Equipment" | "Standard";

/**
 * What the `expiry` date on an item means: `EXP` is a shelf life, `CAL` is a
 * calibration due date. The two read the same on a calendar but produce
 * different statuses, which is why the kind travels with the date.
 */
export type ExpiryKind = "EXP" | "CAL";

export type Item = {
  id: string;
  name: string;
  category: Category;
  /** Human-readable shelf, "Bay A · Shelf 2". */
  location: string;
  quantity: number;
  unit: string;
  /** Reorder point: at or below this an item counts as low. */
  min: number;
  /** ISO date, or null for items that neither expire nor need calibration. */
  expiry: string | null;
  expiryKind: ExpiryKind;
  lot: string;
  supplier: string;
  /** Coarser than `location` — the zone filter on the inventory list. */
  zone: string;
  photo?: string;
};

export type StatusKind =
  | "Available"
  | "Low Stock"
  | "Out of Stock"
  | "Expiring Soon"
  | "Expired"
  | "Cal. Due"
  | "Cal. Overdue";

/**
 * A status and how loudly it needs attention. `priority` orders the alert
 * list and the status tracker: 0 is fine, 5 is out of stock.
 */
export type StockStatus = {
  kind: StatusKind;
  priority: number;
};
