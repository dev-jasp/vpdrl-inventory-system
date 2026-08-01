import type { Item, StockStatus } from "@/types/item";

/** Whole days from `from` until `date`; negative once the date has passed. */
export function daysUntil(date: string | null, from: Date) {
  if (!date) return null;
  const target = new Date(`${date}T00:00:00`);
  return Math.round((target.getTime() - from.getTime()) / 86_400_000);
}

/**
 * The single status an item reads as, in the design's precedence order: being
 * out of stock outranks being expired, which outranks being due, which
 * outranks being low. `priority` is what the alert list and tracker sort on.
 */
export function statusOf(item: Item, on: Date): StockStatus {
  const days = daysUntil(item.expiry, on);
  // Equipment is counted in whole units, so it is only low *below* the
  // reorder point; consumables are low as soon as they reach it.
  const low =
    item.category === "Equipment"
      ? item.quantity < item.min
      : item.quantity <= item.min;

  if (item.quantity === 0) return { kind: "Out of Stock", priority: 5 };
  if (days !== null && days < 0) {
    return {
      kind: item.expiryKind === "CAL" ? "Cal. Overdue" : "Expired",
      priority: 4,
    };
  }
  if (days !== null && days <= 30) {
    return {
      kind: item.expiryKind === "CAL" ? "Cal. Due" : "Expiring Soon",
      priority: 3,
    };
  }
  if (low) return { kind: "Low Stock", priority: 2 };
  return { kind: "Available", priority: 0 };
}

/** The one-line "why" under an item's name in the alerts list. */
export function statusReason(
  item: Item,
  status: StockStatus,
  days: number | null,
) {
  switch (status.kind) {
    case "Out of Stock":
      return `${item.id} · 0 ${item.unit}`;
    case "Expired":
      return `${item.id} · expired ${Math.abs(days ?? 0)} d ago`;
    case "Cal. Overdue":
      return `${item.id} · calibration ${Math.abs(days ?? 0)} d overdue`;
    case "Low Stock":
      return `${item.id} · ${item.quantity} ${item.unit}`;
    case "Expiring Soon":
      return `${item.id} · expires in ${days} d`;
    case "Cal. Due":
      return `${item.id} · calibration in ${days} d`;
    default:
      return item.id;
  }
}
