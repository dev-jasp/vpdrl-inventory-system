import { Card, CardTitle } from "@/components/ui/Card";
import type { HorizonBucket } from "@/lib/reports/analytics";

/**
 * How much of the catalogue comes due, and when.
 *
 * Columns in one hue, not four. The buckets are an ordered scale, so position
 * already says which is which and a second encoding in colour would only be
 * decoration — the app's status colours would also be making four promises
 * ("amber means low stock") that a time bucket does not keep. The one place
 * colour carries meaning is the overdue count, which reads in the red text
 * token, the same token the item lists use for the same fact.
 *
 * Every column is labelled with its count and its span, so nothing here is
 * colour-alone or hover-only.
 */
export function ExpiryHorizon({ buckets }: { buckets: HorizonBucket[] }) {
  const peak = Math.max(1, ...buckets.map((bucket) => bucket.count));
  const total = buckets.reduce((sum, bucket) => sum + bucket.count, 0);

  return (
    <Card className="h-full">
      <CardTitle>Expiry & calibration horizon</CardTitle>
      <p className="mt-1 text-[11.5px] font-normal text-text-3">
        {total} dated {total === 1 ? "item" : "items"} by how soon they come due
      </p>

      <div className="mt-6 flex flex-1 items-end gap-3">
        {buckets.map((bucket) => (
          <div key={bucket.label} className="flex flex-1 flex-col items-center">
            {/* Count and column in one bottom-aligned stack, so the figure
                rides on top of its own bar rather than floating at a fixed
                height above a short one. */}
            <div className="flex h-[128px] w-full flex-col justify-end">
              <div
                className="text-center font-mono text-[15px] font-extrabold"
                style={
                  bucket.overdue && bucket.count > 0
                    ? { color: "var(--badge-red-fg)" }
                    : undefined
                }
              >
                {bucket.count}
              </div>
              <div
                className="mt-1.5 w-full rounded-t-[4px] bg-accent"
                style={{
                  // A zero bucket draws nothing; anything else keeps a
                  // minimum sliver so "1 of 200" is still visible.
                  height:
                    bucket.count === 0
                      ? 0
                      : `${Math.max(3, Math.round((bucket.count / peak) * 104))}px`,
                }}
              />
            </div>
            <div className="mt-2.5 font-mono text-[11px] font-medium whitespace-nowrap text-text-2">
              {bucket.label}
            </div>
            <span className="sr-only">
              {bucket.count} {bucket.count === 1 ? "item" : "items"}{" "}
              {bucket.description}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
