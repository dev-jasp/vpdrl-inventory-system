import { Card, CardTitle } from "@/components/ui/Card";
import { CATEGORY_COLORS } from "@/lib/inventory/palette";
import {
  categoryDistribution,
  type TrackedItem,
} from "@/lib/inventory/summary";

/** Circumference of the r=58 ring the design draws the segments on. */
const CIRCUMFERENCE = 364.4;

/**
 * How the catalogue splits by category, as a donut with a legend.
 *
 * The design puts a month picker in the header, but its `donutMonth` state
 * never reaches the donut — the segments are the whole catalogue regardless of
 * the month shown. A control that silently doesn't filter is worse than none,
 * so it is left out until there is per-month data behind it.
 */
export function StockDistribution({ items }: { items: TrackedItem[] }) {
  const arcs = categoryDistribution(items).map((segment) => ({
    ...segment,
    dash: `${Math.max(0, (segment.percent / 100) * CIRCUMFERENCE).toFixed(1)} ${CIRCUMFERENCE}`,
    offset: (-(segment.startPercent / 100) * CIRCUMFERENCE).toFixed(1),
  }));

  return (
    <Card>
      <CardTitle>Stock Distribution</CardTitle>

      <div className="relative mx-auto mt-[38px] mb-7 size-[172px]">
        <svg viewBox="0 0 160 160" className="size-full">
          <circle
            cx="80"
            cy="80"
            r="58"
            fill="none"
            stroke="var(--muted)"
            strokeWidth="13"
          />
          {arcs.map((arc) => (
            <circle
              key={arc.category}
              cx="80"
              cy="80"
              r="58"
              fill="none"
              stroke={CATEGORY_COLORS[arc.category]}
              strokeWidth="13"
              strokeLinecap="butt"
              strokeDasharray={arc.dash}
              strokeDashoffset={arc.offset}
              transform="rotate(-90 80 80)"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-[26px] font-extrabold">
            {items.length}
          </span>
          <span className="text-[11px] font-medium text-text-3">
            Total SKUs
          </span>
        </div>
      </div>

      <ul className="mt-1.5 flex flex-col gap-[11px]">
        {arcs.map((arc) => (
          <li key={arc.category} className="flex items-center gap-[10px]">
            <span
              aria-hidden
              className="size-2 flex-none rounded-full"
              style={{ background: CATEGORY_COLORS[arc.category] }}
            />
            <span className="flex-1 text-[12.5px] font-normal">
              {arc.label}
            </span>
            <span
              aria-hidden
              className="h-[5px] max-w-[78px] min-w-6 flex-1 overflow-hidden rounded-full bg-muted"
            >
              <span
                className="block h-full rounded-full"
                style={{
                  width: `${arc.rounded}%`,
                  background: CATEGORY_COLORS[arc.category],
                }}
              />
            </span>
            <span className="w-[38px] text-right font-mono text-xs font-normal text-text-2">
              {arc.rounded}%
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
