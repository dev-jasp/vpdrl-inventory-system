"use client";

import { useState } from "react";

import { Card, CardTitle } from "@/components/ui/Card";

const WEEKS = 12;

/** The design's three gridlines: peak, half, nothing. */
function ticksOf(peak: number) {
  return [
    { value: peak, top: "0%" },
    { value: Math.round(peak / 2), top: "50%" },
    { value: 0, top: "100%" },
  ];
}

function weekLabel(index: number) {
  if (index === WEEKS - 1) return "now";
  return index % 3 === 0 ? `W-${WEEKS - 1 - index}` : "";
}

function weekName(index: number) {
  return index === WEEKS - 1 ? "This week" : `Week -${WEEKS - 1 - index}`;
}

/**
 * Units withdrawn per week over the last twelve, hand-drawn like the
 * dashboard's trend: the design pins the geometry, so a chart library would
 * draw its own picture rather than this one.
 */
export function Withdrawals({
  usage,
  unit,
}: {
  /** Twelve weekly totals, oldest first. */
  usage: number[];
  unit: string;
}) {
  const [hover, setHover] = useState<number | null>(null);

  const peak = Math.max(...usage);
  const total = usage.reduce((a, b) => a + b, 0);
  const ticks = ticksOf(peak);

  return (
    <Card className="pb-4">
      <div className="flex items-start">
        <div>
          <CardTitle>Withdrawals</CardTitle>
          <p className="mt-[3px] text-[12px] font-normal text-text-3">
            Last {WEEKS} weeks
          </p>
        </div>
        {/* A phrase, so it stays in the sans. */}
        <div className="ml-auto text-[12.5px] font-semibold text-text-2">
          {total} {unit} withdrawn
        </div>
      </div>

      <div className="relative mt-4 pl-[34px]">
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 h-[118px] w-7"
        >
          {ticks.map((tick) => (
            <div
              key={tick.top}
              className="absolute right-0 -translate-y-1/2 font-mono text-[11px] font-normal text-text-3"
              style={{ top: tick.top }}
            >
              {tick.value}
            </div>
          ))}
        </div>

        <div className="relative h-[118px] border-b border-grid">
          {ticks.map((tick) => (
            <div
              key={tick.top}
              aria-hidden
              className="absolute inset-x-0 h-px bg-grid-soft"
              style={{ top: tick.top }}
            />
          ))}

          <div className="absolute inset-0 flex items-end gap-[7px]">
            {usage.map((value, index) => (
              <div
                key={index}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(null)}
                className="relative flex h-full flex-1 flex-col justify-end"
              >
                <div
                  className="rounded-t"
                  style={{
                    // A week with no withdrawals still shows a sliver, so the
                    // bar reads as empty rather than as missing.
                    height: `${Math.max(4, Math.round((value / peak) * 100))}%`,
                    background:
                      index === WEEKS - 1
                        ? "var(--accent)"
                        : "var(--tint-blue)",
                  }}
                />
                {hover === index ? (
                  <div className="pointer-events-none absolute bottom-[calc(100%_+_6px)] left-1/2 z-6 -translate-x-1/2 rounded-lg border border-grid bg-surface px-[11px] py-2 text-[11.5px] font-normal whitespace-nowrap shadow-[var(--shadow-2)]">
                    <div className="mb-[5px] text-[10.5px] text-text-3">
                      {weekName(index)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden
                        className="size-2 flex-none rounded-sm bg-accent"
                      />
                      <span className="text-text-3">Withdrawn</span>
                      <span className="ml-auto pl-3.5 font-mono font-semibold">
                        {value} {unit}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div aria-hidden className="mt-2 flex gap-[7px]">
          {usage.map((_, index) => (
            <div
              key={index}
              className="flex-1 text-center text-[10.5px] font-normal text-text-3"
            >
              {weekLabel(index)}
            </div>
          ))}
        </div>
      </div>

      {/* Hover-only chart, so the numbers are readable here too. */}
      <table className="sr-only">
        <caption>Units withdrawn per week over the last {WEEKS} weeks</caption>
        <thead>
          <tr>
            <th scope="col">Week</th>
            <th scope="col">Withdrawn</th>
          </tr>
        </thead>
        <tbody>
          {usage.map((value, index) => (
            <tr key={index}>
              <th scope="row">{weekName(index)}</th>
              <td>
                {value} {unit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
