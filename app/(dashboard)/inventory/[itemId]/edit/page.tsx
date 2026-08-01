import Link from "next/link";
import { notFound } from "next/navigation";

import { ItemForm } from "@/components/inventory/ItemForm";
import { findItem, knownZones } from "@/lib/inventory/store";

// Edit item, as a page — the same form as `/inventory/new`, prefilled. The
// modal at `app/(dashboard)/@modal/(.)inventory/[itemId]/edit` is what a
// navigation from inside the app gets; this is the direct-visit fallback.

const cancelClass =
  "flex h-10 items-center rounded-[10px] border border-border-strong bg-surface px-4 text-[13px] font-bold text-text hover:bg-muted";

export default async function EditInventoryItemPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = await params;
  const item = findItem(itemId);
  if (!item) notFound();

  return (
    <div className="mx-auto w-full max-w-[860px] overflow-hidden rounded-[18px] border border-border bg-surface shadow-[var(--shadow-1)]">
      <div className="border-b border-border-soft px-[26px] pt-[22px] pb-[18px]">
        <h2 className="text-xl font-extrabold tracking-[-0.025em]">
          {item.name}
        </h2>
        <p className="mt-1 text-[10px] font-bold tracking-[0.12em] text-text-4">
          EDIT ITEM · {item.id}
        </p>
      </div>
      <ItemForm
        item={item}
        zones={knownZones()}
        cancel={
          <Link href={`/inventory/${item.id}`} className={cancelClass}>
            Cancel
          </Link>
        }
      />
    </div>
  );
}
