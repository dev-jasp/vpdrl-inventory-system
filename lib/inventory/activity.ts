import type { Item } from "@/types/item";
import { hash } from "@/lib/shared/hash";

export type ActivityEntry = {
  /** ISO date. */
  date: string;
  text: string;
  /** Who did it. */
  who: string;
};

/**
 * An item's recent history, ported from the design's `dLog`. Synthetic, like
 * `lotsOf` and `weeklyUsage`: the quantities come off `hash(id)` so an item
 * always shows the same history, and the dates are the design's own, written
 * against `TODAY` rather than the wall clock.
 *
 * The names are the design's verbatim, initials and all — they don't quite
 * line up with `data/staff.ts` (Okafor is Amelia, Lindqvist is Tomas), but
 * this is a stand-in until activity is a real record, and the design is the
 * spec until then.
 */
export function activityOf(item: Item): ActivityEntry[] {
  const h = hash(item.id);

  return [
    {
      date: "2026-07-27",
      text: `Cycle count verified · ${item.quantity} ${item.unit} on hand`,
      who: "T. Okafor",
    },
    {
      date: "2026-07-21",
      text: `Withdrawn ${1 + (h % 3)} ${item.unit} · Bench ${1 + (h % 4)}`,
      who: "M. Reyes",
    },
    {
      date: "2026-07-09",
      text: `Received ${4 + (h % 6)} ${item.unit} · PO 447${h % 9}`,
      who: "Receiving",
    },
    {
      date: "2026-06-30",
      text: `Reorder point set to ${item.min} ${item.unit}`,
      who: "A. Lindqvist",
    },
  ];
}
