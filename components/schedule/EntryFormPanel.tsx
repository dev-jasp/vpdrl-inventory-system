import { allItems } from "@/lib/inventory/store";
import {
  parseScheduleQuery,
  scheduleHref,
  type RawSearchParams,
} from "@/lib/schedule/filters";
import { defaultKind } from "@/lib/schedule/form";
import { allStaff } from "@/lib/staff/store";
import { allSuppliers } from "@/lib/suppliers/store";
import type { ScheduleEntry } from "@/types/schedule";
import { EntryForm } from "./EntryForm";

/**
 * The form with the stores read for it. Both the modal and the page mount
 * this, so the pickers are built once — and from the stores rather than the
 * seeds, so a supplier added ten seconds ago is already in the list.
 *
 * The calendar state rides in on `searchParams` and back out as `back`, which
 * is what lets Cancel and a finished save return to the day the form was
 * opened from. `lib/schedule/filters.ts` owns both ends of that.
 */
export function EntryFormPanel({
  entry,
  params,
  cancel,
}: {
  entry?: ScheduleEntry;
  params: RawSearchParams;
  cancel: React.ReactNode;
}) {
  const query = parseScheduleQuery(params);

  const calibratable = allItems()
    .filter((item) => item.expiryKind === "CAL" && item.expiry)
    .map((item) => ({ id: item.id, name: item.name }));

  return (
    <EntryForm
      entry={entry}
      staff={allStaff()}
      suppliers={allSuppliers().map((supplier) => supplier.name)}
      calibratable={calibratable}
      // A new entry opens on the day being looked at, and on the kind the
      // sidebar is filtered to — adding from the Deliveries view means adding
      // a delivery far more often than it means anything else.
      defaultDate={query.date}
      defaultKind={defaultKind(query.kind)}
      back={scheduleHref(query)}
      cancel={cancel}
    />
  );
}
