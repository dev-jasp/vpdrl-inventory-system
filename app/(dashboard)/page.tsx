import { Alerts } from "@/components/dashboard/Alerts";
import { OnDutyToday } from "@/components/dashboard/OnDutyToday";
import { SpendVsBudget } from "@/components/dashboard/SpendVsBudget";
import { StockDistribution } from "@/components/dashboard/StockDistribution";
import { StockStatusTracker } from "@/components/dashboard/StockStatusTracker";
import { TopConsumed } from "@/components/dashboard/TopConsumed";
import { ITEMS } from "@/data/items";
import { track } from "@/lib/inventory/summary";
import { TODAY } from "@/lib/shared/dates";

// Dashboard. Still to build from `LabTrack Dashboard.dc.html`: handover note,
// to-do list, consumption trend, recent activity, upcoming calibrations.

export default function DashboardPage() {
  // Resolved once here and passed down, so every card agrees on the statuses.
  const items = track(ITEMS, TODAY);

  return (
    <div className="flex flex-col gap-3">
      {/* The design's header row: on duty, handover note, then today's date
          and the to-do list. The latter two are still to build. */}
      <div className="flex flex-wrap items-center gap-3.5">
        <OnDutyToday />
      </div>

      {/* Three columns, as the design lays them out. It has no media queries
          at all, so narrow screens stay a whole-shell follow-up. */}
      <div className="grid grid-cols-3 gap-5">
        <StockDistribution items={items} />
        <SpendVsBudget />
        <Alerts items={items} />
        {/* Consumption Trend takes the two-column slot beside this one. */}
        <TopConsumed items={items}>
          <StockStatusTracker items={items} />
        </TopConsumed>
      </div>
    </div>
  );
}
