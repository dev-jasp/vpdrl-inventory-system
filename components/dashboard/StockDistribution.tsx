import { Card, CardTitle } from "@/components/ui/Card";
import { CATEGORY_COLORS } from "@/lib/inventory/palette";
import {
  categoryDistribution,
  type TrackedItem,
} from "@/lib/inventory/summary";

/** Circumference of the r=58 ring the design draws the segments on. */
const CIRCUMFERENCE = 364.4;

/**
 * The break between two segments, in path units — 3 of the 364 the ring runs,
 * against a 13-unit stroke, so the break is a good deal narrower than the ring
 * is thick. Enough to separate one category from the next; not so much that the
 * ring starts reading as five detached arcs. Half of it comes off each end of a
 * segment, so every arc stays centred on the share it actually represents.
 */
const GAP = 3;

/**
 * The shortest arc still worth drawing. A category smaller than the gap would
 * otherwise come out at zero length and vanish from the ring entirely while
 * still holding a row in the legend, which reads as a bug rather than as a
 * small number.
 */
const MIN_ARC = 1.5;

/**
 * How the catalogue splits by category, as a donut with a legend.
 *
 * The design puts a month picker in the header, but its `donutMonth` state
 * never reaches the donut — the segments are the whole catalogue regardless of
 * the month shown. A control that silently doesn't filter is worse than none,
 * so it is left out until there is per-month data behind it.
 */
export function StockDistribution({ items }: { items: TrackedItem[] }) {
  const arcs = categoryDistribution(items).map((segment) => {
    const span = (segment.percent / 100) * CIRCUMFERENCE;
    const start = (segment.startPercent / 100) * CIRCUMFERENCE;

    return {
      ...segment,
      dash: `${Math.max(MIN_ARC, span - GAP).toFixed(1)} ${CIRCUMFERENCE}`,
      offset: (-(start + GAP / 2)).toFixed(1),
    };
  });

  return (
    <Card>
      <CardTitle>Stock Distribution</CardTitle>

      {/* The box grows, the viewBox doesn't: r, stroke and gap are all in the
          same 160-unit space, so sizing the box scales the ring and its breaks
          together and there is one number to change. */}
      <div className="relative mx-auto mt-7 mb-6 size-48">
        <svg viewBox="0 0 160 160" className="size-full">
          {/* No track circle behind the segments. It was a backing for a ring
              that met itself all the way round; behind gapped arcs it shows
              through every break as a grey sliver, which reads as a sixth
              category rather than as a gap. */}
          {/* The ring rolls into place on load. The rotation is on this group,
              not on the arcs — each of those carries its own `rotate(-90)` to
              put twelve o'clock at the top, and the two compose rather than
              fight. `lt-roll-origin` is what pins the spin to the ring's own
              centre; see `app/globals.css`. */}
          <g className="lt-roll-origin animate-lt-roll">
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
          </g>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* The count tracks the hole it sits in: at the design's 26px it
              looked stranded in the middle of the larger ring. */}
          <span className="font-mono text-[30px] font-extrabold">
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
