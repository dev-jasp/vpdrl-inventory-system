import { ExpiryHorizon } from "@/components/reports/ExpiryHorizon";
import { ReportCard } from "@/components/reports/ReportCard";
import { ReportStats, type Stat } from "@/components/reports/ReportStats";
import { SupplierOnTime } from "@/components/reports/SupplierOnTime";
import { REPORTS } from "@/data/reports";
import { allItems } from "@/lib/inventory/store";
import { track } from "@/lib/inventory/summary";
import {
  averageOnTime,
  expiryHorizon,
  onTimeRanking,
  totalSpend,
} from "@/lib/reports/analytics";
import { reportSize } from "@/lib/reports/generate";
import { peso } from "@/lib/shared/currency";
import { TODAY } from "@/lib/shared/dates";
import { supplierRows } from "@/lib/suppliers/performance";
import { allSuppliers } from "@/lib/suppliers/store";

// Reports — generated summaries, exports and audit trails with downloads.
//
// The card grid is the design's (`reportsRaw` in `LabTrack Dashboard.dc.html`).
// The analytics band above it is not: the design draws no charts here. It
// summarises the ground the six reports cover, from the same stores they are
// generated from, so a figure on screen and the same figure in the CSV cannot
// disagree. See `docs/adr/0003-reports-analytics.md`.
//
// Dynamic rather than prerendered: every size on a card is measured by
// generating that report, and the stores change under it.
export const dynamic = "force-dynamic";

export default function ReportsPage() {
  const items = track(allItems(), TODAY);
  const suppliers = supplierRows(allSuppliers(), allItems());

  const attention = items.filter((item) => item.status.priority > 0).length;

  const stats: Stat[] = [
    {
      label: "ITEMS ON RECORD",
      value: String(items.length),
      note: `across ${new Set(items.map((item) => item.zone)).size} zones`,
    },
    {
      label: "NEEDING ATTENTION",
      value: String(attention),
      note: "low, out of stock, expiring or due",
      // The one figure here that is a warning rather than a measurement.
      tone: attention > 0 ? "var(--badge-amber-fg)" : undefined,
    },
    {
      label: "ON-TIME DELIVERY",
      value: `${averageOnTime(suppliers)}%`,
      note: "mean across suppliers in use",
    },
    {
      label: "SPEND TO DATE",
      value: peso(totalSpend()),
      note: "seven months to July 2026",
    },
  ];

  return (
    <div className="flex flex-col gap-[18px] pt-3">
      {/* The design pairs its title with this line, but the title is the
          topbar's here — `PageTitle` already renders "Reports" as the page's
          only h1, and a second one would say it twice. */}
      <p className="text-[13px] font-normal text-text-3">
        Generated summaries, exports and audit trails
      </p>

      <ReportStats stats={stats} />

      <div className="grid grid-cols-2 gap-5">
        <ExpiryHorizon buckets={expiryHorizon(items)} />
        <SupplierOnTime suppliers={onTimeRanking(suppliers)} />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[18px]">
        {REPORTS.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            size={reportSize(report.id)}
          />
        ))}
      </div>
    </div>
  );
}
