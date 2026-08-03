import Link from "next/link";

import { Card, CardTitle } from "@/components/ui/Card";
import { STATUS_TRACK_COLORS } from "@/lib/inventory/palette";
import {
  countByPriority,
  statusSummary,
  type TrackedItem,
} from "@/lib/inventory/summary";

/**
 * Stock status: the four counts, then one block per SKU ordered calmest to
 * loudest. Its own card, stacked under Top Consumed. The design hangs it off
 * the bottom of that card below a rule, but a rule inside a card is doing a
 * card's job — the split gives the two readings the same standing as every
 * other card on the dashboard, at the same 20px gutter.
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
    <Card>
      <CardTitle>Stock Status</CardTitle>

      <ul className="mt-4 grid grid-cols-2 gap-x-[18px] gap-y-2">
        {summary.map((bucket) => (
          <li key={bucket.label} className="flex items-center gap-2">
            <span
              aria-hidden
              className="size-[7px] flex-none rounded-full"
              style={{ background: bucket.color }}
            />
            <span className="flex-1 text-xs font-normal">{bucket.label}</span>
            <span className="font-mono text-[12.5px] font-normal">
              {bucket.count}
            </span>
          </li>
        ))}
      </ul>

      {/* 20px blocks rather than the design's 26px: splitting the card off
          costs a second set of card padding plus the gutter, and the track is
          the one element here that reads the same a little shorter. */}
      <ul className="mt-3.5 flex gap-0.5">
        {blocks.map((item) => (
          <li key={item.id} className="min-w-0 flex-1">
            <Link
              href={`/inventory/${item.id}`}
              // 41 blocks would otherwise each prefetch their own route.
              prefetch={false}
              title={`${item.name} · ${item.status.kind}`}
              className="block h-5 rounded-[3px] hover:opacity-[0.72]"
              style={{ background: STATUS_TRACK_COLORS[item.status.kind] }}
            >
              <span className="sr-only">
                {item.name} · {item.status.kind}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-[9px] flex justify-between text-[11px] font-normal text-text-3">
        {/* Both of these are phrases, so they stay in the sans. */}
        <span>
          {available} of {items.length} available
        </span>
        <span>1 block = 1 SKU</span>
      </div>
    </Card>
  );
}
