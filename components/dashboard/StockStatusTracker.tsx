import Link from "next/link";

import { STATUS_TRACK_COLORS } from "@/lib/inventory/palette";
import {
  countByPriority,
  statusSummary,
  type TrackedItem,
} from "@/lib/inventory/summary";

/**
 * Stock status: the four counts, then one block per SKU ordered calmest to
 * loudest. A section rather than a card — the design hangs it off the bottom
 * of Top Consumed, below a rule.
 */
export function StockStatusTracker({ items }: { items: TrackedItem[] }) {
  const summary = statusSummary(items);
  const available = countByPriority(items, 0);
  const blocks = items
    .slice()
    .sort(
      (a, b) =>
        a.status.priority - b.status.priority || a.name.localeCompare(b.name),
    );

  return (
    <div className="mt-[18px] border-t border-border-soft pt-3.5">
      <h3 className="text-[10px] font-bold tracking-[0.12em] text-text-4">
        STOCK STATUS
      </h3>

      <ul className="mt-[11px] grid grid-cols-2 gap-x-[18px] gap-y-2">
        {summary.map((bucket) => (
          <li key={bucket.label} className="flex items-center gap-2">
            <span
              aria-hidden
              className="size-[7px] flex-none rounded-full"
              style={{ background: bucket.color }}
            />
            <span className="flex-1 text-xs font-semibold">{bucket.label}</span>
            <span className="text-[12.5px] font-extrabold">{bucket.count}</span>
          </li>
        ))}
      </ul>

      <ul className="mt-4 flex gap-0.5">
        {blocks.map((item) => (
          <li key={item.id} className="min-w-0 flex-1">
            <Link
              href={`/inventory/${item.id}`}
              // 41 blocks would otherwise each prefetch their own route.
              prefetch={false}
              title={`${item.name} · ${item.status.kind}`}
              className="block h-[26px] rounded-[3px] hover:opacity-[0.72]"
              style={{ background: STATUS_TRACK_COLORS[item.status.kind] }}
            >
              <span className="sr-only">
                {item.name} · {item.status.kind}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-[9px] flex justify-between text-[11px] font-medium text-text-3">
        <span>
          {available} of {items.length} available
        </span>
        <span>1 block = 1 SKU</span>
      </div>
    </div>
  );
}
