"use client";

import Link from "next/link";
import { useState } from "react";

import { Card, CardTitle } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
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
 * dragging the whole 41-item tracker into the client bundle for one dropdown.
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
        <Select
          label="Consumption window"
          value={String(weeks)}
          onValueChange={(next) => setWeeks(Number(next))}
          options={WINDOWS.map((option) => ({
            value: String(option.weeks),
            label: option.label,
          }))}
          align="end"
          className="ml-auto h-7 rounded-lg px-2 text-xs"
        />
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
                <span className="absolute inset-0 flex items-center truncate px-[9px] text-xs font-normal text-text">
                  {item.name}
                </span>
              </span>
              <span className="flex-none text-right font-mono text-xs font-medium whitespace-nowrap text-text-3">
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
