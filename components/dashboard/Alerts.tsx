import Link from "next/link";

import { ItemPhoto } from "@/components/inventory/ItemPhoto";
import { Card, CardTitle } from "@/components/ui/Card";
import { STATUS_BADGES } from "@/lib/inventory/palette";
import { statusReason } from "@/lib/inventory/status";
import { flagged, type TrackedItem } from "@/lib/inventory/summary";

/** The design lists five, with "View all" for the rest. */
const VISIBLE = 5;

/** Everything needing attention, loudest first. */
export function Alerts({ items }: { items: TrackedItem[] }) {
  const rows = flagged(items).slice(0, VISIBLE);

  return (
    <Card className="pb-2">
      <div className="flex items-start">
        <CardTitle>Alerts</CardTitle>
        {/* "View all" is the inventory list sorted by priority, descending. */}
        <Link
          href="/inventory?sort=p&dir=-1"
          className="ml-auto text-[12.5px] font-semibold text-[#3b82f6] hover:text-[#2563eb]"
        >
          View all
        </Link>
      </div>
      <ul className="mt-3">
        {rows.map((item) => {
          const badge = STATUS_BADGES[item.status.kind];
          return (
            <li key={item.id}>
              <Link
                href={`/inventory/${item.id}`}
                className="-mx-1.5 flex items-center gap-[11px] rounded-[9px] border-t border-border-soft px-1.5 py-[11px] hover:bg-muted"
              >
                <ItemPhoto
                  category={item.category}
                  photo={item.photo}
                  size={38}
                  className="rounded-[9px]"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold">
                    {item.name}
                  </span>
                  <span className="mt-0.5 block text-[11.5px] font-normal text-text-3">
                    {statusReason(item, item.status, item.days)}
                  </span>
                </span>
                <span
                  className="rounded-full border px-[9px] py-1 text-[11px] font-semibold whitespace-nowrap"
                  style={{
                    background: badge.background,
                    color: badge.color,
                    borderColor: badge.border,
                  }}
                >
                  {item.status.kind}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
