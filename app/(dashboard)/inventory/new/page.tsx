import Link from "next/link";

import { ItemForm } from "@/components/inventory/ItemForm";
import { knownZones } from "@/lib/inventory/store";

// Add item, as a page. The design only ever draws this as a modal, which is
// what `app/(dashboard)/@modal/(.)inventory/new` renders for navigations from
// inside the app; this is what a direct visit, a refresh or a shared link
// gets, where there is no list behind it to lay a modal over.

// The zone picker is built from the store, which the form itself writes to, so
// this cannot be prerendered once and reused.
export const dynamic = "force-dynamic";

const cancelClass =
  "flex h-10 items-center rounded-[10px] border border-border-strong bg-surface px-4 text-[13px] font-semibold text-text hover:bg-muted";

export default function NewInventoryItemPage() {
  return (
    <div className="mx-auto w-full max-w-[860px] overflow-hidden rounded-[18px] border border-border bg-surface shadow-[var(--shadow-1)]">
      <div className="border-b border-border-soft px-[26px] pt-[22px] pb-[18px]">
        <h2 className="text-xl font-semibold tracking-[-0.025em]">
          New inventory item
        </h2>
        <p className="mt-1 text-[10px] font-semibold tracking-[0.12em] text-text-4">
          ADD TO INVENTORY
        </p>
      </div>
      <ItemForm
        zones={knownZones()}
        cancel={
          <Link href="/inventory" className={cancelClass}>
            Cancel
          </Link>
        }
      />
    </div>
  );
}
