import type { Category, Item } from "@/types/item";
import type { Supplier } from "@/types/supplier";

/**
 * How an on-time percentage reads.
 *
 * The two thresholds are the design's own: `out.suppliers` computes an
 * `onTimeColor` at 96 and 90 and then never draws it, because the supplier
 * table it built stops at ITEMS. This is that reading finished rather than a
 * scale invented here.
 *
 * The band is named as well as coloured. Three shades of "delivery is fine"
 * are the kind of distinction that disappears for anyone who cannot separate
 * green from amber, and the word costs a line the cell already has room for.
 */
export type OnTimeBandKind = "Excellent" | "Reliable" | "Watch";

/**
 * `color` is a badge foreground token rather than the design's literal
 * `#10b981` / `#0ea5e9` / `#f59e0b`. Those three are fills — as small text on
 * `--surface` the green lands around 2.5:1, and none of them has a dark-mode
 * counterpart, so the column would strand itself the moment the theme flips.
 * The tokens are the values the rest of the app already reads amber and green
 * in. Same bands, same meaning, legible in both themes.
 */
export type OnTimeBand = { kind: OnTimeBandKind; color: string };

export function onTimeBand(onTime: number): OnTimeBand {
  if (onTime >= 96) {
    return { kind: "Excellent", color: "var(--badge-green-fg)" };
  }
  if (onTime >= 90) return { kind: "Reliable", color: "var(--accent-fg)" };
  return { kind: "Watch", color: "var(--badge-amber-fg)" };
}

/** A supplier with what the catalogue says about it resolved. */
export type SupplierRow = Supplier & {
  itemCount: number;
  /** What they supply, for the line under the name. */
  categories: Category[];
};

/**
 * Suppliers with their catalogue joined on, busiest first — the order the
 * design puts them in, which reads as "who this lab actually depends on".
 *
 * Ties break on name. The design leaves them in seed order, but a tie here is
 * not rare — everyone supplying nothing ties at zero — and a list that reads
 * unordered where it happens to be dense is worse than one that is
 * alphabetical there.
 */
export function supplierRows(
  suppliers: Supplier[],
  items: Item[],
): SupplierRow[] {
  return suppliers
    .map((supplier) => {
      const supplied = items.filter((item) => item.supplier === supplier.name);
      return {
        ...supplier,
        itemCount: supplied.length,
        categories: [...new Set(supplied.map((item) => item.category))],
      };
    })
    .sort((a, b) => b.itemCount - a.itemCount || a.name.localeCompare(b.name));
}
