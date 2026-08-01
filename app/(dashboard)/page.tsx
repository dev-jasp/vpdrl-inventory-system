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
      <div className="flex flex-wrap items-center gap-3.5">
        <OnDutyToday />
      </div>

      {/* Two three-column grids, as the design lays them out: the trend spans
          two columns beside Stock Distribution, then Spend / Alerts / Top
          Consumed. The design has no media queries, so narrow screens stay a
          whole-shell follow-up. */}
      <div className="grid grid-cols-3 gap-5">
        <ConsumptionTrend />
        <StockDistribution items={items} />
      </div>

      <div className="grid grid-cols-3 gap-5">
        <SpendVsBudget />
        <Alerts items={items} />
        <TopConsumed items={items}>
          <StockStatusTracker items={items} />
        </TopConsumed>
      </div>
    </div>
  );
}
