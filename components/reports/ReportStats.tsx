import { Card } from "@/components/ui/Card";

/**
 * The four headline figures above the reports.
 *
 * Stat tiles rather than charts: each is one number with no dimension to plot
 * against, and a four-bar chart of unrelated measures would be a chart in the
 * shape of a table. Figures set in the mono face at the weight the dashboard's
 * totals use — see `docs/adr/0001-typography.md`.
 */
export type Stat = {
  label: string;
  value: string;
  /** The line under the figure — what it counts, or how it is doing. */
  note: string;
  /** Text token for the figure, for the one tile that can read as an alarm. */
  tone?: string;
};

export function ReportStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-4 gap-5">
      {stats.map((stat) => (
        <Card key={stat.label} className="py-[18px]">
          <div className="text-[10px] font-semibold tracking-[0.12em] text-text-4">
            {stat.label}
          </div>
          <div
            className="mt-[5px] font-mono text-[26px] leading-none font-extrabold"
            style={stat.tone ? { color: stat.tone } : undefined}
          >
            {stat.value}
          </div>
          <div className="mt-2 text-[11.5px] font-normal text-text-3">
            {stat.note}
          </div>
        </Card>
      ))}
    </div>
  );
}
