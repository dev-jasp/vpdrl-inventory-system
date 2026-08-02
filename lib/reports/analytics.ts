import { SPEND } from "@/data/spend";
import type { TrackedItem } from "@/lib/inventory/summary";
import type { SupplierRow } from "@/lib/suppliers/performance";

/**
 * What the analytics band above the report cards reports.
 *
 * It exists to summarise the same ground the six reports cover, so every
 * figure here is derived from the stores the reports are generated from — a
 * number on this page and the same number in the CSV cannot disagree.
 */

/**
 * The compliance horizon: how far away each dated item's expiry or calibration
 * is, in four ordered buckets.
 *
 * The 30-day boundary is not chosen here — it is the threshold `statusOf` in
 * `lib/inventory/status.ts` already uses to call something Expiring Soon or
 * Cal. Due, so the chart's second bucket is exactly the set of items the app
 * flags. 90 days is the one boundary this adds, splitting "not yet a concern"
 * into the next quarter and beyond it.
 */
export type HorizonBucket = {
  label: string;
  /** Spelled out for the row's accessible text, where the label is a shorthand. */
  description: string;
  count: number;
  /** True for the bucket that is already a problem, which reads in the alarm colour. */
  overdue?: boolean;
};

export function expiryHorizon(items: TrackedItem[]): HorizonBucket[] {
  const dated = items.filter((item) => item.days !== null);
  const within = (from: number, to: number) =>
    dated.filter((item) => item.days! >= from && item.days! <= to).length;

  return [
    {
      label: "Overdue",
      description: "past its expiry or calibration date",
      count: dated.filter((item) => item.days! < 0).length,
      overdue: true,
    },
    {
      label: "≤ 30 d",
      description: "due within 30 days",
      count: within(0, 30),
    },
    {
      label: "31–90 d",
      description: "due in 31 to 90 days",
      count: within(31, 90),
    },
    {
      label: "> 90 d",
      description: "more than 90 days away",
      count: dated.filter((item) => item.days! > 90).length,
    },
  ];
}

/**
 * Suppliers by on-time delivery, worst first.
 *
 * Worst first because this sits on a reports page: the reason to look at
 * delivery performance is to find who is slipping, and a list that opens on
 * the best performers buries that. Only suppliers the lab actually buys from
 * are included — a supplier with nothing in the catalogue has an on-time
 * percentage with no orders behind it.
 */
export function onTimeRanking(suppliers: SupplierRow[], limit = 8) {
  return suppliers
    .filter((supplier) => supplier.itemCount > 0)
    .sort((a, b) => a.onTime - b.onTime || a.name.localeCompare(b.name))
    .slice(0, limit);
}

/** Mean on-time percentage across the suppliers actually in use. */
export function averageOnTime(suppliers: SupplierRow[]) {
  const inUse = suppliers.filter((supplier) => supplier.itemCount > 0);
  if (inUse.length === 0) return 0;
  const total = inUse.reduce((sum, supplier) => sum + supplier.onTime, 0);
  return Math.round(total / inUse.length);
}

/** Spend across every month the seed covers, for the fourth tile. */
export function totalSpend() {
  return SPEND.reduce((sum, month) => sum + month.spend, 0);
}
