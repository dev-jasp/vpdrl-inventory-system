import type { Item } from "@/types/item";

/**
 * The three zones the stock bar is divided into. The widths are shares of the
 * bar, not of any item's numbers, so every item's bar reads the same way.
 */
export const STOCK_BANDS = [
  { label: "Below reorder", width: 50, color: "var(--tint-red)" },
  { label: "Healthy", width: 35, color: "var(--tint-green)" },
  { label: "Overstocked", width: 15, color: "var(--tint-blue)" },
];

/**
 * Where an item sits on that bar.
 *
 * The scale runs to twice the reorder point, which is what makes the fixed
 * bands mean something: half of twice the reorder point is the reorder point,
 * so the red band ends exactly where the item stops being low. `Math.max(1)`
 * keeps items with no reorder point off a zero-width scale.
 */
export function stockPosition(item: Item) {
  const scale = Math.max(1, item.min * 2);
  return {
    scale,
    // Past twice the reorder point the marker parks at the end rather than
    // running off the bar.
    markerPercent: Math.max(0, Math.min(100, (item.quantity / scale) * 100)),
  };
}
