import Link from "next/link";
import { notFound } from "next/navigation";

import { ExpiryCard } from "@/components/inventory/ExpiryCard";
import { ItemActivity } from "@/components/inventory/ItemActivity";
import { ItemLots } from "@/components/inventory/ItemLots";
import { ItemSpecification } from "@/components/inventory/ItemSpecification";
import { StockPosition } from "@/components/inventory/StockPosition";
import { Withdrawals } from "@/components/inventory/Withdrawals";
import { allItems } from "@/lib/inventory/store";
import { activityOf } from "@/lib/inventory/activity";
import { listHref, parseInventoryQuery } from "@/lib/inventory/filters";
import { lotsOf } from "@/lib/inventory/lots";
import { STATUS_BADGES } from "@/lib/inventory/palette";
import { track, weeklyUsage } from "@/lib/inventory/summary";
import { TODAY } from "@/lib/shared/dates";

// Item detail — stock position against the reorder point, the lots making up
// that stock, withdrawals, activity, specification and the dated control.
// Built from `LabTrack Dashboard.dc.html`.
//
// It reads the list's searchParams as well as its own id, but only to know
// where "Back to inventory" goes; nothing on the page is filtered by them.

const USAGE_WEEKS = 12;

export default async function InventoryItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ itemId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { itemId } = await params;
  const query = parseInventoryQuery(await searchParams);

  const item = track(allItems(), TODAY).find(
    (candidate) => candidate.id === itemId,
  );
  if (!item) notFound();

  const badge = STATUS_BADGES[item.status.kind];
  const lots = lotsOf(item, TODAY);

  return (
    <div className="flex flex-col gap-5">
      <Link
        href={listHref(query)}
        className="self-start text-[12.5px] font-bold text-[#3b82f6] hover:text-[#2563eb]"
      >
        ← Back to inventory
      </Link>

      <div className="flex items-end gap-4">
        <div>
          <h2 className="text-[26px] font-extrabold tracking-[-0.03em]">
            {item.name}
          </h2>
          <div className="mt-[9px]">
            <span
              className="inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold"
              style={{
                background: badge.background,
                color: badge.color,
                borderColor: badge.border,
              }}
            >
              {item.status.kind}
            </span>
          </div>
        </div>

        <div className="ml-auto flex gap-2.5">
          {/* Inert in the design, since it has no purchase-order flow. This
              repo routes them, so it points at the section that will own it. */}
          <Link
            href="/purchase-orders"
            className="flex h-10 items-center rounded-[10px] border border-border-strong bg-surface px-4 text-[13px] font-bold text-text hover:bg-muted"
          >
            Request order
          </Link>
          <Link
            href={`/inventory/${item.id}/edit`}
            className="flex h-10 items-center rounded-[10px] bg-[#3b82f6] px-[18px] text-[13px] font-bold text-white hover:bg-[#2563eb]"
          >
            Edit item
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-5">
        <div className="flex flex-col gap-5">
          <StockPosition item={item} />
          {/* Calibrated equipment and empty shelves have no lots to show. */}
          {lots.length > 0 ? <ItemLots lots={lots} unit={item.unit} /> : null}
          <Withdrawals
            usage={weeklyUsage(item.id, USAGE_WEEKS)}
            unit={item.unit}
          />
          <ItemActivity entries={activityOf(item)} />
        </div>

        <div className="flex flex-col gap-5">
          <ItemSpecification item={item} />
          <ExpiryCard item={item} />
        </div>
      </div>
    </div>
  );
}
