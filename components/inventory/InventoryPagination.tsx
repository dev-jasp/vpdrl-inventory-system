import Link from "next/link";

import { NavSelect } from "@/components/ui/NavSelect";
import {
  PER_PAGE_OPTIONS,
  type InventoryQuery,
  inventoryHref,
} from "@/lib/inventory/filters";
import { cx } from "@/utils/cx";

const stepClass =
  "flex h-[34px] items-center rounded-[9px] border border-border-strong bg-surface px-[13px] text-[12.5px] font-bold";

/**
 * The pager, in the shape the design gives the staff list — the inventory list
 * in the mockup shows every item at once, so this is the same control applied
 * to a longer table.
 *
 * Every step is a link, so a page is somewhere you can be sent rather than a
 * state you have to arrive at by clicking.
 */
export function InventoryPagination({
  query,
  page,
  pages,
  total,
}: {
  query: InventoryQuery;
  /** Clamped page, which may differ from the one asked for in the URL. */
  page: number;
  pages: number;
  total: number;
}) {
  const from = (page - 1) * query.per + 1;
  const to = Math.min(page * query.per, total);

  return (
    <nav
      aria-label="Inventory pages"
      className="mt-[18px] flex flex-wrap items-center gap-3"
    >
      <span className="text-[12.5px] font-semibold text-text-3">
        Rows per page
      </span>
      <NavSelect
        label="Rows per page"
        value={String(query.per)}
        options={PER_PAGE_OPTIONS.map((per) => ({
          value: String(per),
          label: String(per),
          href: inventoryHref(query, { per }),
        }))}
        className="h-[34px] rounded-[9px] px-2.5"
      />
      <span className="ml-1.5 text-[12.5px] font-semibold text-text-4">
        {total === 0
          ? "No items match these filters"
          : `${from}–${to} of ${total}`}
      </span>

      <div className="ml-auto flex items-center gap-2">
        {page === 1 ? (
          <span aria-disabled className={cx(stepClass, "text-text-4")}>
            Previous
          </span>
        ) : (
          <Link
            href={inventoryHref(query, { page: page - 1 })}
            rel="prev"
            className={cx(stepClass, "text-text-2 hover:bg-muted")}
          >
            Previous
          </Link>
        )}

        {Array.from({ length: pages }, (_, index) => index + 1).map(
          (number) => {
            const current = number === page;
            return (
              <Link
                key={number}
                href={inventoryHref(query, { page: number })}
                aria-label={`Page ${number}`}
                aria-current={current ? "page" : undefined}
                className={cx(
                  "flex h-[34px] min-w-[34px] items-center justify-center rounded-[9px] border px-2.5 text-[12.5px] font-bold",
                  current
                    ? "border-[#3b82f6] bg-[#3b82f6] text-white"
                    : "border-border-strong bg-surface text-text-2 hover:bg-muted",
                )}
              >
                {number}
              </Link>
            );
          },
        )}

        {page === pages ? (
          <span aria-disabled className={cx(stepClass, "text-text-4")}>
            Next
          </span>
        ) : (
          <Link
            href={inventoryHref(query, { page: page + 1 })}
            rel="next"
            className={cx(stepClass, "text-text-2 hover:bg-muted")}
          >
            Next
          </Link>
        )}
      </div>
    </nav>
  );
}
