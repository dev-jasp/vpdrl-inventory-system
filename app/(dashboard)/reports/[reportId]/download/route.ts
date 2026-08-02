import { findReport } from "@/data/reports";
import { buildReport } from "@/lib/reports/generate";

/**
 * The file behind a report card's Download.
 *
 * A route handler rather than a click handler that assembles a Blob: Download
 * stays an ordinary `<a download>`, which means it works before hydration, is
 * keyboard-reachable, and can be opened in a new tab or copied as a link —
 * the same reasoning that keeps the table rows real links.
 *
 * Built per request from the stores, so a report reflects what the app holds
 * now rather than what it held at build time.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reportId: string }> },
) {
  const { reportId } = await params;
  const report = findReport(reportId);
  if (!report) return new Response("No such report", { status: 404 });

  const content = buildReport(report.id);
  if (content === null) {
    return new Response("That report has no generator", { status: 404 });
  }

  return new Response(content, {
    headers: {
      // `charset` is not optional here: the catalogue carries µ, ± and ₱, and
      // a CSV opened without it mojibakes in Excel.
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${report.id}.csv"`,
      // Generated from mutable stores, so it must not be cached.
      "Cache-Control": "no-store",
    },
  });
}
