"use client";

import Link from "next/link";
import { useState } from "react";

import { Card, CardTitle } from "@/components/ui/Card";
import { topConsumed, type TrackedItem } from "@/lib/inventory/summary";

const WINDOWS = [
  { weeks: 4, label: "Last 4 weeks" },
  { weeks: 12, label: "Last 12 weeks" },
];

/**
 * The most-withdrawn items over a 4- or 12-week window. Client-side because
 * the window is a local choice that doesn't belong in the URL — nothing else
 * on the dashboard reacts to it.
 *
 * `children` is the stock status section, which the design hangs off the
 * bottom of this card. Taking it as a prop keeps it server-rendered instead of
 * dragging the whole 41-item tracker into the client bundle for a `<select>`.
 */
export function TopConsumed({
  items,
  children,
}: {
  items: TrackedItem[];
  children?: React.ReactNode;
}) {
  const [weeks, setWeeks] = useState(12);
  const rows = topConsumed(items, weeks);
  const max = rows[0]?.used ?? 1;

  return (
    <Card>
      <div className="flex items-start">
        <CardTitle>Top Consumed</CardTitle>
        <label className="ml-auto">
          <span className="sr-only">Consumption window</span>
          <select
            value={weeks}
            onChange={(event) => setWeeks(Number(event.target.value))}
            className="h-7 rounded-lg border border-border-strong bg-surface px-2 text-xs font-semibold text-text outline-none"
          >
            {WINDOWS.map((option) => (
              <option key={option.weeks} value={option.weeks}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ul className="mt-4 flex flex-col gap-1.5">
        {rows.map(({ item, used }) => (
          <li key={item.id}>
            <Link
              href={`/inventory/${item.id}`}
              className="flex items-center gap-3 hover:opacity-[0.78]"
            >
              <span className="relative h-[26px] min-w-0 flex-1">
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 rounded bg-tint-blue"
                  style={{ width: `${Math.round((used / max) * 100)}%` }}
                />
                <span className="absolute inset-0 flex items-center truncate px-[9px] text-xs font-medium text-text">
                  {item.name}
                </span>
              </span>
              <span className="flex-none text-right text-xs font-semibold whitespace-nowrap text-text-3">
                {used} {item.unit} / {weeks} wk
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {children}
    </Card>
  );
}
