import type { Report } from "@/types/report";

/** Bytes as the design writes a file size — "640 KB", "1.2 MB". */
export function fileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

/**
 * One generated report, as the design's card: format badge, name, period,
 * what it contains, and the generated line with a download.
 *
 * Download is an `<a download>` pointed at the route handler rather than a
 * button, because it goes somewhere and fetches something — so it can be
 * middle-clicked, copied, and works before hydration.
 */
export function ReportCard({ report, size }: { report: Report; size: number }) {
  return (
    <article className="flex flex-col gap-3 rounded-[14px] border border-border bg-surface px-[22px] py-5 shadow-[var(--shadow-1)]">
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="grid size-9 flex-none place-items-center rounded-[9px] bg-[#3b82f6] text-[10px] font-semibold tracking-[0.02em] text-white"
        >
          {report.format}
        </span>
        <div className="min-w-0">
          <h2 className="text-[14.5px] leading-[1.3] font-semibold">
            {report.name}
          </h2>
          <p className="mt-[3px] text-[11.5px] font-normal text-text-3">
            {report.period}
          </p>
        </div>
      </div>

      <p className="text-[12.5px] leading-[1.5] font-normal text-text-2">
        {report.description}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-border-soft pt-3">
        <span className="font-mono text-[11.5px] font-medium text-text-4">
          {report.generated} · {fileSize(size)}
        </span>
        <a
          href={`/reports/${report.id}/download`}
          download={`${report.id}.csv`}
          className="flex h-8 items-center rounded-lg bg-tint-blue px-3.5 text-xs font-semibold text-accent-fg hover:brightness-95"
        >
          Download
          {/* The card's heading is the only thing naming the report, and a
              page of six "Download" links is a page of six identical links. */}
          <span className="sr-only"> {report.name}</span>
        </a>
      </div>
    </article>
  );
}
