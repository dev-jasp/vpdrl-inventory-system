import { ItemFormDialog } from "@/components/inventory/ItemFormDialog";
import { knownZones } from "@/lib/inventory/store";

// `/inventory/new` reached from inside the app: the design's form as a modal
// over the list. A direct visit or a refresh falls through to the full page at
// `app/(dashboard)/inventory/new`.

// Dynamic for the same reason as the page it intercepts: the zone picker is
// built from the store, which the form itself writes to, so it cannot be
// prerendered once and reused.
export const dynamic = "force-dynamic";

export default function NewItemModal() {
  return <ItemFormDialog zones={knownZones()} />;
}
