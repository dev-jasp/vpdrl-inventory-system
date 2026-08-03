"use client";

import { useEffect, useId, useState } from "react";

import { Card, CardTitle } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { CONSUMPTION_WINDOWS } from "@/data/consumption";
import {
  AXIS_TICKS,
  CHART,
  consumptionWindow,
  formatDelta,
  pathOf,
  percentDown,
  pointsOf,
  tickY,
} from "@/lib/inventory/consumption";
import { cx } from "@/utils/cx";

const numbers = new Intl.NumberFormat("en-GB");

/**
 * Units withdrawn per month by category, over the last 3, 6 or 12 months.
 *
 * Hand-drawn SVG rather than the vendored Tremor kit in `components/charts/`:
 * the design pins the geometry (a 900×210 box stretched to fit, gridlines at
 * fixed values, an axis that doesn't autoscale) and Recharts would draw its
 * own chart, not this one.
 *
 * The design also computes an area path and a date-range caption but renders
 * neither, so this is lines only — matching what the design actually draws.
 */
export function ConsumptionTrend() {
  const [months, setMonths] = useState(12);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const menuId = useId();

  const { months: labels, series, total, delta } = consumptionWindow(months);
  const leadPoints = pointsOf(series[0].values);
  const band = CHART.width / (labels.length - 1);
  const positive = delta >= 0;

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <Card className="col-span-2 pb-4">
      <div className="flex items-start gap-4">
        <CardTitle>Consumption Trend</CardTitle>
        <div className="relative ml-auto">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? menuId : undefined}
            className="flex h-7 w-35 items-center justify-between gap-2 truncate rounded-lg border border-border-strong bg-surface px-2.5 text-[12.5px] font-normal text-text outline-none"
          >
            Last {months} months
            <Icon name="chevron" className="size-3.5 flex-none text-text-3" />
          </button>
          {menuOpen ? (
            <>
              <div
                className="fixed inset-0 z-5"
                onClick={() => setMenuOpen(false)}
                aria-hidden
              />
              <div
                id={menuId}
                // Sized and offset off the trigger rather than fixed. At least
                // as wide as the button, then as wide as its longest row needs
                // — the trigger truncates a long label, but a menu that wraps
                // one across two lines is just harder to read. Right-anchored,
                // so the overspill grows inward. 34px is the button's 28px plus
                // the 6px gap the shared Select puts under its trigger.
                className="absolute top-8.5 right-0 z-6 w-max min-w-full rounded-xl border border-border bg-surface p-1.5 shadow-[var(--shadow-2)]"
              >
                {CONSUMPTION_WINDOWS.map((option) => {
                  const selected = option === months;
                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        setMonths(option);
                        setMenuOpen(false);
                      }}
                      className={cx(
                        "flex w-full items-center justify-between gap-2.5 rounded-lg px-2.5 py-[9px] text-[13px] whitespace-nowrap text-text hover:bg-bg",
                        selected ? "font-semibold" : "font-normal",
                      )}
                    >
                      Last {option} months
                      {selected ? (
                        <Icon
                          name="check"
                          className="size-3.5 text-accent-fg"
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className="mt-[18px]">
        <div className="text-xs font-semibold tracking-[0.12em] text-text-4">
          TOTAL UNITS WITHDRAWN
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          {/* Tight tracking belonged to the sans; mono sets its own rhythm. */}
          <span className="font-mono text-[27px] font-extrabold">
            {numbers.format(total)}
          </span>
          <span
            className={cx(
              "rounded-full px-2 py-[3px] font-mono text-[11.5px] font-medium",
              positive
                ? "bg-badge-green-bg text-badge-green-fg"
                : "bg-badge-red-bg text-badge-red-fg",
            )}
          >
            {formatDelta(delta)}
          </span>
        </div>
      </div>

      <div className="mt-3.5 flex justify-end gap-[18px]">
        {series.map((entry) => (
          <span
            key={entry.key}
            className="flex items-center gap-[7px] text-[11.5px] font-normal text-text-3"
          >
            <span
              aria-hidden
              className="h-[3px] w-3.5 rounded-full"
              style={{ background: entry.color }}
            />
            {entry.label}
          </span>
        ))}
      </div>

      <div className="relative mt-2 h-[260px] pl-9">
        <svg
          viewBox={`0 0 ${CHART.width} ${CHART.height}`}
          preserveAspectRatio="none"
          aria-hidden
          className="absolute inset-y-0 right-0 left-9 h-full w-[calc(100%_-_36px)] overflow-visible"
        >
          {AXIS_TICKS.map((tick) => (
            <line
              key={tick}
              x1="0"
              y1={tickY(tick)}
              x2={CHART.width}
              y2={tickY(tick)}
              stroke={tick === 0 ? "var(--grid)" : "var(--grid-soft)"}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* Back to front, so the busiest series sits on top. */}
          {[...series].reverse().map((entry) => (
            <path
              key={entry.key}
              d={pathOf(entry.values)}
              fill="none"
              stroke={entry.color}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {hover !== null && leadPoints[hover] ? (
            <line
              x1={leadPoints[hover].x}
              y1={CHART.top}
              x2={leadPoints[hover].x}
              y2={CHART.bottom}
              stroke="var(--text-4)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ) : null}

          {leadPoints.map((point, index) => {
            const x = Math.max(0, point.x - band / 2);
            return (
              <rect
                key={labels[index]}
                x={x}
                y="0"
                width={Math.min(band, CHART.width - x)}
                height={CHART.height}
                fill="transparent"
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(null)}
              />
            );
          })}
        </svg>

        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 h-full w-[30px]"
        >
          {AXIS_TICKS.map((tick) => (
            <div
              key={tick}
              className="absolute right-0 -translate-y-1/2 font-mono text-[11px] font-normal text-text-3"
              style={{ top: percentDown(tickY(tick)) }}
            >
              {tick}
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-y-0 right-0 left-9">
          {labels.map((label, index) => (
            <div
              key={label}
              aria-hidden
              className="absolute bottom-0 -translate-x-1/2 text-[11px] font-normal whitespace-nowrap text-text-3"
              style={{ left: `${(index / (labels.length - 1)) * 100}%` }}
            >
              {label}
            </div>
          ))}

          {hover !== null && leadPoints[hover] ? (
            <div
              className="absolute z-5 -translate-x-1/2 rounded-lg border border-grid bg-surface px-3 py-2.5 text-[11.5px] font-normal whitespace-nowrap text-text shadow-[var(--shadow-2)]"
              style={{
                left: `${(hover / (labels.length - 1)) * 100}%`,
                top: `calc(${percentDown(leadPoints[hover].y)} - 78px)`,
              }}
            >
              <div className="mb-[7px] text-[10.5px] font-normal text-text-3">
                {labels[hover]}
              </div>
              {series.map((entry, index) => (
                <div
                  key={entry.key}
                  className={cx(
                    "flex items-center gap-2",
                    index > 0 && "mt-[5px]",
                  )}
                >
                  <span
                    className="size-2 flex-none rounded-sm"
                    style={{ background: entry.color }}
                  />
                  <span className="text-text-3">{entry.label}</span>
                  <span className="ml-auto pl-3.5 font-mono font-semibold">
                    {entry.values[hover]}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* The chart is hover-only, so the same numbers are readable here. */}
      <table className="sr-only">
        <caption>
          Units withdrawn per month over the last {months} months
        </caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            {series.map((entry) => (
              <th key={entry.key} scope="col">
                {entry.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {labels.map((label, index) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              {series.map((entry) => (
                <td key={entry.key}>{entry.values[index]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
