import type { Category, Item, StatusKind, StockStatus } from "@/types/item";
import { hash } from "@/lib/shared/hash";
import { daysUntil, statusOf } from "./status";

/** An item with its status resolved once, so views don't each recompute it. */
export type TrackedItem = Item & {
  status: StockStatus;
  /** Days until expiry or calibration; null when the item has no date. */
  days: number | null;
};

export const CATEGORIES: Category[] = [
  "Reagent",
  "Solvent",
  "Consumable",
  "Equipment",
  "Standard",
];

const CATEGORY_PLURALS: Record<Category, string> = {
  Reagent: "Reagents",
  Solvent: "Solvents",
  Consumable: "Consumables",
  Equipment: "Equipment",
  Standard: "Standards",
};

export function track(items: Item[], on: Date): TrackedItem[] {
  return items.map((item) => ({
    ...item,
    status: statusOf(item, on),
    days: daysUntil(item.expiry, on),
  }));
}

/** Everything needing attention, loudest first, then alphabetically. */
export function flagged(items: TrackedItem[]) {
  return items
    .filter((item) => item.status.priority > 0)
    .sort(
      (a, b) =>
        b.status.priority - a.status.priority || a.name.localeCompare(b.name),
    );
}

export function countByStatus(items: TrackedItem[], kind: StatusKind) {
  return items.filter((item) => item.status.kind === kind).length;
}

export function countByPriority(items: TrackedItem[], priority: number) {
  return items.filter((item) => item.status.priority === priority).length;
}

/**
 * The four buckets the dashboard reports. Expiring and expired collapse into
 * one line, as they do in the design.
 */
export function statusSummary(items: TrackedItem[]) {
  return [
    { label: "Available", count: countByPriority(items, 0), color: "#10b981" },
    {
      label: "Low Stock",
      count: countByStatus(items, "Low Stock"),
      color: "#f59e0b",
    },
    {
      label: "Out of Stock",
      count: countByStatus(items, "Out of Stock"),
      color: "#ef4444",
    },
    {
      label: "Expiring / due",
      count: countByPriority(items, 3) + countByPriority(items, 4),
      color: "#8b5cf6",
    },
  ];
}

/**
 * Share of the catalogue held by each category, for the donut. `startPercent`
 * is how far round the ring the segment begins, so the caller can lay the
 * arcs out without carrying a running total.
 */
export function categoryDistribution(items: TrackedItem[]) {
  const counts = CATEGORIES.map((category) => ({
    category,
    label: CATEGORY_PLURALS[category],
    count: items.filter((item) => item.category === category).length,
  }));

  let start = 0;
  const segments = [];
  for (const entry of counts) {
    const percent = items.length === 0 ? 0 : (entry.count / items.length) * 100;
    segments.push({
      ...entry,
      percent,
      rounded: Math.round(percent),
      startPercent: start,
    });
    start += percent;
  }
  return segments;
}

/**
 * Synthetic weekly withdrawals, ported from the design's `usage()`. Derived
 * from the item id so a given item always shows the same history — a stand-in
 * until withdrawals are real records.
 */
export function weeklyUsage(id: string, weeks: number) {
  const h = hash(id);
  return Array.from({ length: weeks }, (_, week) => {
    const wave =
      (Math.sin(h * 0.0007 + week * 1.31) + Math.sin(h * 0.013 + week * 0.61)) /
        4 +
      0.5;
    return Math.round(1 + wave * 13);
  });
}

/** The most-withdrawn items over `weeks`, highest first. */
export function topConsumed(items: TrackedItem[], weeks: number, limit = 4) {
  return items
    .map((item) => ({
      item,
      used: weeklyUsage(item.id, weeks).reduce((a, b) => a + b, 0),
    }))
    .sort((a, b) => b.used - a.used)
    .slice(0, limit);
}
