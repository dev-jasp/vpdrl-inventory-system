import Link from "next/link";

import { NavSelect } from "@/components/ui/NavSelect";
import {
  CATEGORY_FILTERS,
  FLAG_FILTERS,
  type InventoryQuery,
  inventoryHref,
} from "@/lib/inventory/filters";
import { cx } from "@/utils/cx";

/**
 * The design's pill. Only the inactive state gets a hover — the chips are
 * links here rather than the mockup's buttons, and a link that changes the
 * page under you should say so on the way in.
 */
function chipClass(active: boolean) {
  return cx(
    "inline-flex h-[31px] items-center rounded-full border px-[13px] text-[12.5px] font-semibold whitespace-nowrap",
    active
      ? "border-tint-blue bg-tint-blue text-accent-fg"
      : "border-border-strong bg-surface text-text-2 hover:bg-muted",
  );
}

/**
 * Category, flag and zone filters, as the design lays them out across the top
 * of the list card. Each one is a link to the same list read a different way,
 * so the browser's back button walks back through the filters.
 */
export function InventoryFilters({
  query,
  zones,
}: {
  query: InventoryQuery;
  zones: string[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border-soft px-[18px] py-3.5">
      {CATEGORY_FILTERS.map((category) => (
        <Link
          key={category}
          href={inventoryHref(query, { category })}
          aria-current={query.category === category ? "true" : undefined}
          className={chipClass(query.category === category)}
        >
          {category}
        </Link>
      ))}

      <span aria-hidden className="mx-1.5 h-5 w-px bg-grid" />

      {FLAG_FILTERS.map((flag) => {
        const active = query.flag === flag.value;
        return (
          <Link
            key={flag.value}
            // Clicking the flag you are already on clears it, as in the design.
            href={inventoryHref(query, { flag: active ? null : flag.value })}
            aria-current={active ? "true" : undefined}
            className={chipClass(active)}
          >
            {flag.label}
          </Link>
        );
      })}

      {/* Search comes from the topbar, which leaves nothing on the page to say
          the list is narrowed or to widen it again. This is that. */}
      {query.q ? (
        <Link
          href={inventoryHref(query, { q: "" })}
          className={cx(chipClass(true), "gap-1.5")}
        >
          <span className="max-w-[220px] truncate">“{query.q}”</span>
          <span aria-hidden className="text-[14px] leading-none">
            ×
          </span>
          <span className="sr-only">Clear search</span>
        </Link>
      ) : null}

      <NavSelect
        label="Filter by zone"
        value={query.zone}
        options={zones.map((zone) => ({
          value: zone,
          label: zone === "All" ? "All zones" : zone,
          href: inventoryHref(query, { zone }),
        }))}
        className="ml-auto h-[31px] rounded-full"
      />

      <Link
        href="/inventory/new"
        className="inline-flex h-[31px] items-center rounded-full bg-[#3b82f6] px-3.5 text-[12.5px] font-bold text-white hover:bg-[#2563eb]"
      >
        + Add item
      </Link>
    </div>
  );
}
