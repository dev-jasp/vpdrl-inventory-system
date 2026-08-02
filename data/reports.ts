import type { Report } from "@/types/report";

/**
 * The report catalogue, ported from `reportsRaw` in
 * `design/LabTrack Dashboard.dc.html` — names, descriptions, periods and
 * generated dates verbatim.
 *
 * Two columns of the design's row are not here. `fmt` is always CSV now (see
 * `types/report.ts`), and the seeded file size is gone: each report is built
 * from live data on request, so its size is measured from the bytes actually
 * produced rather than asserted. The design's "1.2 MB" described a document
 * nothing in this repo generates.
 */
export const REPORTS: Report[] = [
  {
    id: "monthly-stock-summary",
    name: "Monthly Stock Summary",
    description:
      "Full inventory snapshot with stock levels by category and zone",
    period: "July 2026",
    generated: "2026-07-28",
    format: "CSV",
  },
  {
    id: "expiry-compliance-audit",
    name: "Expiry & Compliance Audit",
    description:
      "Expired, expiring and calibration-overdue items with audit trail",
    period: "Q3 2026",
    generated: "2026-07-25",
    format: "CSV",
  },
  {
    id: "supplier-performance-review",
    name: "Supplier Performance Review",
    description: "On-time delivery, lead times and spend by supplier",
    period: "H1 2026",
    generated: "2026-07-01",
    format: "CSV",
  },
  {
    id: "consumption-by-category",
    name: "Consumption by Category",
    description: "Withdrawal trends across reagents, solvents and consumables",
    period: "Last 12 months",
    generated: "2026-07-28",
    format: "CSV",
  },
  {
    id: "purchase-order-log",
    name: "Purchase Order Log",
    description: "All purchase orders raised, approved and received",
    period: "July 2026",
    generated: "2026-07-29",
    format: "CSV",
  },
  {
    id: "calibration-schedule",
    name: "Calibration Schedule",
    description: "Upcoming and completed equipment calibrations",
    period: "Q3 2026",
    generated: "2026-07-20",
    format: "CSV",
  },
];

export function findReport(id: string) {
  return REPORTS.find((report) => report.id === id);
}
