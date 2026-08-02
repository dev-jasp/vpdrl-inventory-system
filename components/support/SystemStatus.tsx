import { Card, CardTitle } from "@/components/ui/Card";
import { SYSTEM_STATUS } from "@/data/support";
import { longDate, TODAY } from "@/lib/shared/dates";

/**
 * Whether the system is up.
 *
 * The dot is the design's, and it is never the only thing saying so — the state
 * is written out beside it, which is what makes it legible to anyone who cannot
 * separate the green from the amber, and to anyone whose forced-colours mode
 * drops the fill entirely.
 *
 * The time is pinned to `TODAY` like every other date in the app, because
 * nothing is actually being checked — see `data/support.ts`.
 */
export function SystemStatus() {
  const { operational, checkedAt } = SYSTEM_STATUS;

  return (
    <Card>
      <CardTitle>Status</CardTitle>

      <p className="mt-3.5 flex items-center gap-2 text-[13px] font-medium">
        <span
          aria-hidden
          className="size-2 flex-none rounded-full"
          style={{ background: operational ? "#10b981" : "#f59e0b" }}
        />
        {operational ? "All systems operational" : "Degraded performance"}
      </p>

      <p className="mt-1.5 text-[11.5px] font-normal text-text-3">
        Last checked {longDate(TODAY)}, {checkedAt}
      </p>
    </Card>
  );
}
