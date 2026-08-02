import { Card } from "@/components/ui/Card";
import type { TrackedItem } from "@/lib/inventory/summary";
import { cx } from "@/utils/cx";

/**
 * The item's one dated control, which for equipment is a calibration due date
 * and for everything else a shelf life — the distinction `expiryKind` carries.
 */
export function ExpiryCard({ item }: { item: TrackedItem }) {
  const calibration = item.expiryKind === "CAL";

  // A sentence, so it stays in the sans even though it carries a number.
  const note =
    item.days === null
      ? "No dated control for this item"
      : item.days < 0
        ? `${Math.abs(item.days)} days past due — quarantine and replace`
        : `In ${item.days} days`;

  return (
    <Card>
      <h2 className="text-[10px] font-semibold tracking-[0.12em] text-text-4">
        {calibration ? "CALIBRATION DUE" : "EXPIRY DATE"}
      </h2>
      {/* A date is a reading, so it sets in the mono at the 800 Chivo actually
          has. "Not applicable" is words: sans, the design's tight tracking,
          and 700 — the most Uncut Sans offers. */}
      <p
        className={cx(
          "mt-2 text-2xl",
          item.expiry
            ? "font-mono font-extrabold"
            : "font-semibold tracking-[-0.03em]",
        )}
      >
        {item.expiry ?? "Not applicable"}
      </p>
      <p className="mt-1 text-[12.5px] font-normal text-text-3">{note}</p>
    </Card>
  );
}
