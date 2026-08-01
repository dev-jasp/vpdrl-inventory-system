import type { Item } from "@/types/item";
import { hash } from "@/lib/shared/hash";

export type Lot = {
  /** Lot code, the item's own with its trailing number stepped on. */
  lot: string;
  quantity: number;
  /** ISO expiry for this lot, later than the item's for later deliveries. */
  expiry: string;
  days: number;
  location: string;
  /** ISO date this lot was received. */
  received: string;
};

function ymd(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * The deliveries an item's stock is made up of, ported from the design's
 * `lots()`. Synthetic — split out of the item's own quantity and expiry with
 * `hash(id)` as the seed, the same stand-in trick `weeklyUsage` uses, so an
 * item always shows the same lots until deliveries are real records.
 *
 * Calibrated equipment and empty shelves have none: a calibration date is a
 * property of the instrument, not of a batch.
 */
export function lotsOf(item: Item, on: Date): Lot[] {
  if (item.expiryKind === "CAL" || !item.expiry || item.quantity <= 0)
    return [];

  const base = new Date(`${item.expiry}T00:00:00`);
  if (Number.isNaN(base.getTime())) return [];

  const h = hash(item.id);
  const count = h % 5 === 0 ? 3 : h % 3 === 0 ? 1 : 2;

  const lots: Lot[] = [];
  let left = item.quantity;
  for (let i = 0; i < count; i++) {
    // The last lot takes the remainder, so the shares always add back up to
    // the quantity on hand however the rounding falls.
    const share =
      i === count - 1
        ? left
        : Math.max(0, Math.round(item.quantity * (i === 0 ? 0.45 : 0.3)));
    left -= share;
    if (share <= 0) continue;

    const expiry = new Date(base.getTime());
    expiry.setDate(expiry.getDate() + i * (60 + ((h >> (i + 2)) % 90)));
    const received = new Date(on.getTime());
    received.setDate(received.getDate() - (40 + i * 55 + (h % 30)));

    lots.push({
      lot: /\d+$/.test(item.lot)
        ? item.lot.replace(/\d+$/, (digits) =>
            String(Number(digits) + i * 7).padStart(digits.length, "0"),
          )
        : `${item.lot || "LOT"}-${i + 1}`,
      quantity: share,
      expiry: ymd(expiry),
      days: Math.round((expiry.getTime() - on.getTime()) / 86_400_000),
      location: item.location,
      received: ymd(received),
    });
  }

  return lots.sort((a, b) => a.expiry.localeCompare(b.expiry));
}

export type LotStatusKind = "Good" | "Expiring" | "Expired";

/**
 * A lot's own state, which is not the item's: an item can read Available while
 * the oldest lot on its shelf is already past its date. Same 30-day warning
 * window `statusOf` uses.
 */
export function lotStatus(lot: Lot): LotStatusKind {
  if (lot.days < 0) return "Expired";
  return lot.days <= 30 ? "Expiring" : "Good";
}
