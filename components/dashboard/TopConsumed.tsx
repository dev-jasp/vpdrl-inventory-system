"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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
 * The one card on the dashboard that animates its data. Changing the window
 * reorders the rows, retargets every bar and can swap items in and out of the
 * top four — all at once. That is a state change the user asked for, so it is
 * worth showing; the rest of the dashboard's numbers stay still.
 */
export function TopConsumed({ items }: { items: TrackedItem[] }) {
  const [weeks, setWeeks] = useState(12);
  const reduceMotion = useReducedMotion();
  const rows = topConsumed(items, weeks);
  const max = rows[0]?.used ?? 1;

  /**
   * The house curve from `app/globals.css`, in Motion's tuple form. 180ms is
   * deliberately under the CSS vocabulary's 200ms: these are figures being
   * read, and a leaderboard that takes its time settling reads as lag rather
   * than as polish.
   */
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.18, ease: [0.2, 0.8, 0.3, 1] as const };

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
          className="ml-auto h-7 w-35 rounded-lg px-2.5 text-xs font-normal"
        />
      </div>

      <ul className="mt-4 flex flex-col gap-1.5">
        {/* `popLayout` takes a departing row out of flow immediately, so the
            rows below it slide up into the space rather than waiting for it to
            finish fading. `initial={false}` keeps the first paint still — the
            card's own entrance is the CSS stagger, not this. */}
        <AnimatePresence initial={false} mode="popLayout">
          {rows.map(({ item, used }) => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
            >
              <Link
                href={`/inventory/${item.id}`}
                className="flex items-center gap-3 transition-opacity duration-150 ease-out hover:opacity-[0.78]"
              >
                <span className="relative h-[26px] min-w-0 flex-1">
                  <motion.span
                    aria-hidden
                    className="absolute inset-y-0 left-0 rounded bg-tint-blue"
                    // Snaps to width on mount and tweens only on a later
                    // change, so the bars don't grow from zero on every load.
                    initial={false}
                    animate={{ width: `${Math.round((used / max) * 100)}%` }}
                    transition={transition}
                  />
                  <span className="absolute inset-0 flex items-center truncate px-[9px] text-xs font-normal text-text">
                    {item.name}
                  </span>
                </span>
                <span className="flex-none text-right font-mono text-xs font-medium whitespace-nowrap text-text-3">
                  {used} {item.unit} / {weeks} wk
                </span>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </Card>
  );
}
