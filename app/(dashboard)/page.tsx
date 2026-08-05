import { Alerts } from "@/components/dashboard/Alerts";
import { ConsumptionTrend } from "@/components/dashboard/ConsumptionTrend";
import { OnDutyToday } from "@/components/dashboard/OnDutyToday";
import { SpendVsBudget } from "@/components/dashboard/SpendVsBudget";
import { StockDistribution } from "@/components/dashboard/StockDistribution";
import { StockStatusTracker } from "@/components/dashboard/StockStatusTracker";
import { TopConsumed } from "@/components/dashboard/TopConsumed";
import { allItems } from "@/lib/inventory/store";
import { track } from "@/lib/inventory/summary";
import { TODAY } from "@/lib/shared/dates";

// Dashboard. Still to build from `LabTrack Dashboard.dc.html`: handover note,
// to-do list, recent activity, upcoming calibrations.

export default function DashboardPage() {
  // Resolved once here and passed down, so every card agrees on the statuses.
  const items = track(allItems(), TODAY);

  return (
    <div className="flex flex-col gap-3">
      {/* The design's header row: on duty, handover note, then today's date
          and the to-do list. The latter two are still to build. */}
      {/* Rises undelayed, ahead of the grid's stagger, so the entrance reads
          top-down rather than as a sixth card. */}
      <div className="flex animate-lt-rise flex-wrap items-center gap-3.5">
        <OnDutyToday />
      </div>

      {/* One three-column grid, as the design lays it out: the trend spans two
          columns beside Stock Distribution, then Spend / Alerts / Top Consumed
          wrap onto the second row. A single grid rather than one per row so the
          gutter between rows is the same 20px as the gutter between columns.
          The design has no media queries, so narrow screens stay a whole-shell
          follow-up. */}
      {/* `lt-stagger` walks the five grid slots in 45ms steps; see the rule in
          `app/globals.css`. On the grid rather than the outer column, so the
          cards stagger against each other instead of the whole grid arriving
          as one block behind the header. */}
      <div className="lt-stagger grid grid-cols-3 gap-5">
        <ConsumptionTrend />
        <StockDistribution items={items} />
        <SpendVsBudget />
        <Alerts items={items} />
        {/* Top Consumed and Stock Status share the third column, stacked at
            the same 20px gutter the grid uses, so the split reads as two cards
            in one slot rather than as a new column. */}
        <div className="flex flex-col gap-5">
          <TopConsumed items={items} />
          <StockStatusTracker items={items} />
        </div>
      </div>
    </div>
  );
}
