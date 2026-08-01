import { Card } from "@/components/ui/Card";
import type { TrackedItem } from "@/lib/inventory/summary";

/**
 * The item's one dated control, which for equipment is a calibration due date
 * and for everything else a shelf life — the distinction `expiryKind` carries.
 */
export function ExpiryCard({ item }: { item: TrackedItem }) {
  const calibration = item.expiryKind === "CAL";

  const note =
    item.days === null
      ? "No dated control for this item"
      : item.days < 0
        ? `${Math.abs(item.days)} days past due — quarantine and replace`
        : `In ${item.days} days`;

  return (
    <Card>
      <h2 className="text-[10px] font-bold tracking-[0.12em] text-text-4">
        {calibration ? "CALIBRATION DUE" : "EXPIRY DATE"}
      </h2>
      <p className="mt-2 text-2xl font-extrabold tracking-[-0.03em]">
        {item.expiry ?? "Not applicable"}
      </p>
      <p className="mt-1 text-[12.5px] font-medium text-text-3">{note}</p>
    </Card>
  );
}
