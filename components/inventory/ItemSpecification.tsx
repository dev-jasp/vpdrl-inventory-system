import { Card, CardTitle } from "@/components/ui/Card";
import type { TrackedItem } from "@/lib/inventory/summary";

/**
 * The item's fixed facts. A description list rather than the design's rows of
 * spans, since that is what these pairs are.
 *
 * A calibrated instrument's identifier is a serial number, not a lot — same
 * field, different word, which is the same distinction `expiryKind` draws.
 */
export function ItemSpecification({ item }: { item: TrackedItem }) {
  const rows: [string, string][] = [
    [item.expiryKind === "CAL" ? "Serial number" : "Lot number", item.lot],
    ["Supplier", item.supplier],
    ["Category", item.category],
    ["Storage location", item.location],
    ["Zone", item.zone],
    ["On hand", `${item.quantity} ${item.unit}`],
    ["Reorder point", `${item.min} ${item.unit}`],
    // Pinned to TODAY like the rest of the seed data, not a live record.
    ["Last cycle count", "2026-07-27 · 08:14"],
  ];

  return (
    <Card className="pb-2.5">
      <CardTitle>Specification</CardTitle>
      <dl className="mt-2">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex gap-3 border-t border-border-soft py-2.5 text-[12.5px]"
          >
            <dt className="w-32 flex-none font-medium text-text-3">{label}</dt>
            <dd className="flex-1 text-right font-bold">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
