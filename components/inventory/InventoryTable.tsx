import Link from "next/link";

import { ItemPhoto } from "@/components/inventory/ItemPhoto";
import {
  SORT_COLUMNS,
  type InventoryQuery,
  inventoryHref,
  itemHref,
  nextSort,
} from "@/lib/inventory/filters";
import { lotsOf } from "@/lib/inventory/lots";
import { STATUS_BADGES } from "@/lib/inventory/palette";
import type { TrackedItem } from "@/lib/inventory/summary";

/** The design's fixed column widths; the item column takes what is left. */
const COLUMN_WIDTHS = [undefined, 138, 190, 122, 168, 132];

/** "cal 2026-11-02" for a calibration, the bare date for a shelf life. */
function expiryText(item: TrackedItem) {
  if (!item.expiry) return "—";
  return item.expiryKind === "CAL" ? `cal ${item.expiry}` : item.expiry;
}

function daysText(days: number | null) {
  if (days === null) return "";
  return days < 0 ? `(${days} d)` : `(+${days} d)`;
}

export function InventoryTable({
  rows,
  query,
  today,
}: {
  rows: TrackedItem[];
  query: InventoryQuery;
  today: Date;
}) {
  return (
    // The design pins the columns and lets the table scroll rather than
    // reflow, so a narrow window slides across it instead of crushing it.
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1020px] table-fixed border-collapse text-left">
        <caption className="sr-only">
          Inventory items, sorted by{" "}
          {SORT_COLUMNS.find((column) => column.key === query.sort)?.label}
        </caption>
        <colgroup>
          {COLUMN_WIDTHS.map((width, index) => (
            <col key={index} style={width ? { width } : undefined} />
          ))}
        </colgroup>

        <thead>
          <tr className="border-b border-border-soft bg-surface-2">
            {SORT_COLUMNS.map((column) => {
              const active = query.sort === column.key;
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={
                    active
                      ? query.dir > 0
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  className="font-bold"
                >
                  <Link
                    href={inventoryHref(query, nextSort(query, column.key))}
                    className="block px-[18px] py-[11px] text-[10.5px] tracking-[0.1em] whitespace-nowrap text-text-4 hover:text-[#3b82f6]"
                  >
                    {column.label}{" "}
                    <span aria-hidden>
                      {active ? (query.dir > 0 ? "↑" : "↓") : ""}
                    </span>
                  </Link>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={SORT_COLUMNS.length}
                className="px-[18px] py-10 text-center text-[13px] font-medium text-text-3"
              >
                No items match these filters.
              </td>
            </tr>
          ) : null}

          {rows.map((item) => {
            const badge = STATUS_BADGES[item.status.kind];
            // Split deliveries are worth flagging in the list; which lots they
            // are is the detail view's business.
            const lots = lotsOf(item, today).length;

            return (
              // Positioned so the item link can cover the whole row, which is
              // what makes the row clickable without nesting anything
              // interactive inside an anchor.
              <tr
                key={item.id}
                className="relative border-b border-border-soft hover:bg-surface-2"
              >
                <td className="px-[18px] py-2.5">
                  <div className="flex items-center gap-3">
                    <ItemPhoto
                      category={item.category}
                      photo={item.photo}
                      size={40}
                      className="rounded-[9px]"
                    />
                    <div className="min-w-0">
                      <Link
                        href={itemHref(query, item.id)}
                        className="block truncate text-[13.5px] font-bold after:absolute after:inset-0 after:content-['']"
                      >
                        {item.name}
                      </Link>
                      <div className="mt-0.5 truncate text-[11.5px] font-medium text-text-3">
                        {item.id} · {item.lot}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-[18px] py-3 text-[12.5px] font-semibold text-text-2">
                  {item.category}
                </td>

                <td className="truncate px-[18px] py-3 text-[12.5px] font-medium text-text-2">
                  {item.location}
                </td>

                <td className="px-[18px] py-3 whitespace-nowrap">
                  <div className="text-[13px] font-bold">
                    {item.quantity} {item.unit}
                  </div>
                  {lots > 1 ? (
                    <div className="mt-0.5 text-[11px] font-semibold text-text-3">
                      {lots} lots
                    </div>
                  ) : null}
                </td>

                <td className="px-[18px] py-3 text-[12.5px] font-medium whitespace-nowrap text-text-2">
                  {expiryText(item)}{" "}
                  <span className="font-semibold text-text-4">
                    {daysText(item.days)}
                  </span>
                </td>

                <td className="px-[18px] py-3">
                  <span
                    className="inline-flex rounded-full border px-[9px] py-1 text-[11px] font-bold whitespace-nowrap"
                    style={{
                      background: badge.background,
                      color: badge.color,
                      borderColor: badge.border,
                    }}
                  >
                    {item.status.kind}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
