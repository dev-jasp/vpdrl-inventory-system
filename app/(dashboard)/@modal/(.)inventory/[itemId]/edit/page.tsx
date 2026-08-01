import { notFound } from "next/navigation";

import { ItemFormDialog } from "@/components/inventory/ItemFormDialog";
import { findItem, knownZones } from "@/lib/inventory/store";

// `/inventory/:itemId/edit` reached from inside the app — the same form as
// `/inventory/new`, prefilled, as a modal over the page behind it.

export default async function EditItemModal({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = await params;
  const item = findItem(itemId);
  if (!item) notFound();

  return <ItemFormDialog item={item} zones={knownZones()} />;
}
