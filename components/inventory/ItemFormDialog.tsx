"use client";

import { useRouter } from "next/navigation";

import { ItemForm } from "@/components/inventory/ItemForm";
import { Dialog } from "@/components/ui/Dialog";
import type { Item } from "@/types/item";

/**
 * The item form as the design draws it — a modal over the list you opened it
 * from. Reached through the intercepted routes in `app/(dashboard)/@modal`, so
 * dismissing it is a back navigation: the URL it masked goes away with it.
 */
export function ItemFormDialog({
  item,
  zones,
}: {
  item?: Item;
  zones: string[];
}) {
  const router = useRouter();
  const close = () => router.back();

  return (
    <Dialog
      title={item ? item.name : "New inventory item"}
      subtitle={item ? `EDIT ITEM · ${item.id}` : "ADD TO INVENTORY"}
      onClose={close}
    >
      <ItemForm
        item={item}
        zones={zones}
        cancel={
          <button
            type="button"
            onClick={close}
            className="flex h-10 items-center rounded-[10px] border border-border-strong bg-surface px-4 text-[13px] font-semibold text-text hover:bg-muted"
          >
            Cancel
          </button>
        }
      />
    </Dialog>
  );
}
