/**
 * A generated report offered for download.
 *
 * The design carries a `fmt` of PDF, XLSX or CSV on each row and colours the
 * badge from it. Every report here is a CSV, because a CSV is the one format
 * this app can actually produce from its own data without a writer library —
 * see `docs/adr/0003-reports-analytics.md`. The field stays a union rather than
 * a constant so adding a real PDF writer later is a type change, not a rewrite.
 */
export type ReportFormat = "CSV";

export type Report = {
  /** Slug, and the segment the download route matches on. */
  id: string;
  name: string;
  description: string;
  /** What span the report covers, as the design words it — "July 2026". */
  period: string;
  /** ISO date the design says it was generated on. */
  generated: string;
  format: ReportFormat;
};
