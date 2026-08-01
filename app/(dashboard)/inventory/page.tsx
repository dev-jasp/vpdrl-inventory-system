import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { Pagination } from "@/components/ui/Pagination";
import { allItems } from "@/lib/inventory/store";
import {
  PER_PAGE_OPTIONS,
  filterItems,
  inventoryHref,
  paginate,
  parseInventoryQuery,
  sortItems,
  zonesOf,
} from "@/lib/inventory/filters";
import { track } from "@/lib/inventory/summary";
import { TODAY } from "@/lib/shared/dates";

// Inventory list. The sidebar's Chemicals / Equipment / Low stock /
// Expiring-due entries are this same page read through searchParams (cat,
// flag, zone, q, sort, dir, page, per) rather than routes of their own, so
// every view of the list is a URL somebody can send.
//
// Still to build from `LabTrack Dashboard.dc.html`: the row's photo tile is a
// file input in the mockup, which lands with the item form and photo capture.

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = parseInventoryQuery(await searchParams);

  const items = track(allItems(), TODAY);
  const matched = sortItems(filterItems(items, query), query);
  const { rows, page, pages, total } = paginate(matched, query);

  return (
    <div className="flex flex-col gap-[18px]">
      <div className="overflow-hidden rounded-[14px] border border-border bg-surface shadow-[var(--shadow-1)]">
        {/* Zones come from the whole catalogue, not the filtered rows, so
            picking one never empties the menu you picked it from. */}
        <InventoryFilters query={query} zones={zonesOf(items)} />
        <InventoryTable rows={rows} query={query} today={TODAY} />
        <div className="border-t border-border-soft px-[18px] py-3 text-[12px] font-medium text-text-3">
          {total} of {items.length} items
        </div>
      </div>

      <Pagination
        label="Inventory pages"
        page={page}
        pages={pages}
        total={total}
        per={query.per}
        perOptions={PER_PAGE_OPTIONS}
        href={(patch) => inventoryHref(query, patch)}
        empty="No items match these filters"
      />
    </div>
  );
}
