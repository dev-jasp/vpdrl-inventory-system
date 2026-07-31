import { OnDutyToday } from "@/components/dashboard/OnDutyToday";

// Dashboard — on-duty today, handover note, to-do list, consumption trend,
// stock distribution, spend vs. budget, alerts, top consumed, stock status
// tracker, recent activity, upcoming calibrations.
// TODO: build the rest from `LabTrack Dashboard.dc.html` — components/dashboard/.

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-3">
      {/* The design's header row: on duty, handover note, then today's date
          and the to-do list. The latter two are still to build. */}
      <div className="flex flex-wrap items-center gap-3.5">
        <OnDutyToday />
      </div>
    </div>
  );
}
