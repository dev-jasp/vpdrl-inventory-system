import { Card, CardTitle } from "@/components/ui/Card";
import type { TrackedItem } from "@/lib/inventory/summary";
import { cx } from "@/utils/cx";

/**
 * The item's fixed facts. A description list rather than the design's rows of
 * spans, since that is what these pairs are.
 *
 * A calibrated instrument's identifier is a serial number, not a lot — same
 * field, different word, which is the same distinction `expiryKind` draws.
 */
export function ItemSpecification({ item }: { item: TrackedItem }) {
  // `mono` marks a value that is a reading rather than a name — a code, a date
  // or a count. The unit rides along with it, so the whole value sets in one
  // face and nothing switches mid-line.
  const rows: { label: string; value: string; mono?: boolean }[] = [
    {
      label: item.expiryKind === "CAL" ? "Serial number" : "Lot number",
      value: item.lot,
      mono: true,
    },
    { label: "Supplier", value: item.supplier },
    { label: "Category", value: item.category },
    { label: "Storage location", value: item.location },
    { label: "Zone", value: item.zone },
    { label: "On hand", value: `${item.quantity} ${item.unit}`, mono: true },
    { label: "Reorder point", value: `${item.min} ${item.unit}`, mono: true },
    // Pinned to TODAY like the rest of the seed data, not a live record.
    { label: "Last cycle count", value: "2026-07-27 · 08:14", mono: true },
  ];

  return (
    <Card className="pb-2.5">
      <CardTitle>Specification</CardTitle>
      <dl className="mt-2">
        {rows.map(({ label, value, mono }) => (
          <div
            key={label}
            className="flex gap-3 border-t border-border-soft py-2.5 text-[12.5px]"
          >
            <dt className="w-32 flex-none font-normal text-text-3">{label}</dt>
            <dd
              className={cx(
                "flex-1 text-right font-semibold",
                mono && "font-mono",
              )}
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
