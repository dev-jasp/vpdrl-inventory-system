import Link from "next/link";

import { SupplierRowMenu } from "@/components/suppliers/SupplierRowMenu";
import { DEFAULT_QUERY, inventoryHref } from "@/lib/inventory/filters";
import { onTimeBand, type SupplierRow } from "@/lib/suppliers/performance";

/**
 * The design's fixed column widths; the supplier column takes what is left.
 *
 * ON-TIME and LEAD TIME are ours. The design carries both numbers on every
 * supplier and edits them in its form, then draws neither — see
 * `lib/suppliers/performance.ts`. Its widths for the five columns it does draw
 * are kept exactly.
 */
const COLUMNS = [
  { label: "SUPPLIER", width: undefined },
  { label: "CONTACT", width: 200 },
  { label: "EMAIL", width: 220 },
  { label: "PHONE", width: 190 },
  { label: "ITEMS", width: 100 },
  { label: "ON-TIME", width: 132 },
  { label: "LEAD TIME", width: 110 },
  // The ⋯ column, which the design leaves headed by an empty box.
  { label: "Row actions", width: 56, unlabelled: true },
];

/**
 * Suppliers, with how well each one delivers.
 *
 * The whole row opens the catalogue filtered to that supplier, which is what
 * the design's row click does (`viewItems` searches the list for the name).
 * That is one link on the name stretched across the row rather than a click
 * handler on the row itself — the same arrangement the inventory and staff
 * tables use, and for the same reason: it stays a real link, keyboard-reachable
 * and openable in a new tab.
 */
export function SuppliersTable({ rows }: { rows: SupplierRow[] }) {
  return (
    // The design pins the columns and lets the table scroll rather than
    // reflow, so a narrow window slides across it instead of crushing it.
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1228px] table-fixed border-collapse text-left">
        <caption className="sr-only">
          Suppliers, with delivery performance, most-supplied first
        </caption>
        <colgroup>
          {COLUMNS.map((column) => (
            <col
              key={column.label}
              style={column.width ? { width: column.width } : undefined}
            />
          ))}
        </colgroup>

        <thead>
          <tr className="border-b border-border-soft bg-surface-2">
            {COLUMNS.map((column) => (
              <th
                key={column.label}
                scope="col"
                className="px-[18px] py-[11px] text-[10.5px] font-semibold tracking-[0.1em] whitespace-nowrap text-text-4"
              >
                {column.unlabelled ? (
                  <span className="sr-only">{column.label}</span>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={COLUMNS.length}
                className="px-[18px] py-10 text-center text-[13px] font-normal text-text-3"
              >
                No suppliers on record.
              </td>
            </tr>
          ) : null}

          {rows.map((supplier) => {
            const band = onTimeBand(supplier.onTime);

            return (
              // Positioned so the catalogue link can cover the whole row, which
              // is what makes the row clickable without nesting anything
              // interactive inside an anchor.
              <tr
                key={supplier.name}
                className="relative border-b border-border-soft hover:bg-surface-2"
              >
                <td className="px-[18px] py-3">
                  <div className="min-w-0">
                    <Link
                      href={inventoryHref(DEFAULT_QUERY, { q: supplier.name })}
                      className="block truncate text-[13.5px] font-semibold after:absolute after:inset-0 after:content-['']"
                    >
                      {supplier.name}
                      {/* The row leads somewhere the name alone doesn't
                          announce, so it says where out loud. */}
                      <span className="sr-only"> — items supplied</span>
                    </Link>
                    <div className="mt-0.5 truncate text-[11.5px] font-normal text-text-3">
                      {supplier.categories.length > 0
                        ? supplier.categories.join(", ")
                        : "—"}
                    </div>
                  </div>
                </td>

                <td className="truncate px-[18px] py-3 text-[12.5px] font-medium text-text-2">
                  {supplier.contact}
                </td>

                <td className="px-[18px] py-3">
                  {/* Positioned, so it stays clickable through the row's cover. */}
                  <a
                    href={`mailto:${supplier.email}`}
                    className="relative block truncate text-[12.5px] font-normal text-accent-fg hover:underline"
                  >
                    {supplier.email}
                  </a>
                </td>

                {/* Sans, not mono: a phone number is the one reading both
                    lists already set in the interface face. */}
                <td className="px-[18px] py-3 text-[12.5px] font-normal whitespace-nowrap text-text-2">
                  {supplier.phone}
                </td>

                <td className="px-[18px] py-3 font-mono text-[13px] font-semibold">
                  {supplier.itemCount}
                </td>

                <td className="px-[18px] py-3 font-mono whitespace-nowrap">
                  <div
                    className="text-[13px] font-semibold"
                    style={{ color: band.color }}
                  >
                    {supplier.onTime}%
                  </div>
                  <div className="mt-0.5 text-[11px] font-medium text-text-3">
                    {band.kind}
                  </div>
                </td>

                <td className="px-[18px] py-3 font-mono text-[13px] font-medium whitespace-nowrap text-text-2">
                  {supplier.leadDays} d
                </td>

                {/* Raised above the row's cover, like the email link, so the
                    menu opens instead of following the row to the catalogue.
                    The name is the identity, so it is what the edit route
                    carries — encoded, since these have spaces and dots. */}
                <td className="relative px-2.5 py-3">
                  <div className="flex justify-center">
                    <SupplierRowMenu
                      name={supplier.name}
                      editHref={`/suppliers/${encodeURIComponent(supplier.name)}/edit`}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
