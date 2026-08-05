"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { cx } from "@/utils/cx";
import { activeChild, type NavChild, type NavChildGroup } from "./navItems";
import { navSubItem, navSubItemActive, navSubLabel } from "./navType";

/**
 * A nav item's sub-list. Which entry reads as active depends on the query
 * string, so this is split out from `Sidebar`: `useSearchParams` suspends
 * while a route is prerendered, and only this list needs to wait for it.
 */
export function NavChildLinks({
  id,
  groups,
}: {
  id: string;
  groups: NavChildGroup[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Resolved against every preset at once — grouping is presentation, and a
  // heading must not change which filter the URL matches.
  const flat = groups.flatMap((group) => group.items);
  return (
    <NavChildList
      id={id}
      groups={groups}
      active={activeChild(flat, pathname, searchParams)}
    />
  );
}

export function NavChildList({
  id,
  groups,
  active,
}: {
  id: string;
  groups: NavChildGroup[];
  active: NavChild | null;
}) {
  return (
    // The rail sits on the container rather than on each list, so it runs
    // unbroken past the headings instead of restarting under every one. It is
    // an absolute child rather than a `border-l` so the active segment has
    // something to overlay: `pl-[13px]` is the old 1px border plus `pl-3`, so
    // the entries themselves have not moved.
    <div id={id} className="relative mt-0.5 mr-0 mb-1 ml-[22px] pl-[13px]">
      <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-border" />
      {groups.map((group, index) => (
        <div key={group.label ?? "ungrouped"}>
          {group.label ? (
            <div
              // Flush with the entries it heads — it labels the run, it does
              // not parent it, so it takes no indent of its own.
              //
              // The first run carries no heading, so it needs no gap above it.
              className={cx(navSubLabel, "px-[10px] pb-1", index > 0 && "pt-2")}
            >
              {group.label}
            </div>
          ) : null}
          <ul aria-label={group.label} className="flex flex-col gap-px">
            {group.items.map((item) => {
              const isActive = item.href === active?.href;
              return (
                <li key={item.href} className="relative">
                  {/* The rail's state: a 2px accent segment over the hairline,
                      spanning exactly the row it marks. Offset by the
                      container's padding, which puts it back on the rail. */}
                  {isActive ? (
                    <span
                      aria-hidden
                      className="absolute inset-y-0 -left-[13px] w-0.5 rounded-full bg-accent-fg"
                    />
                  ) : null}
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cx(
                      // The accent segment is a sibling, not a child, so it
                      // holds its place on the rail while the row presses.
                      "lt-press flex items-center gap-2 rounded-lg px-[10px] py-[7px] hover:bg-bg",
                      isActive ? "text-accent-fg" : "text-text-2",
                    )}
                  >
                    <span
                      className={cx(
                        "flex-1 whitespace-nowrap",
                        isActive ? navSubItemActive : navSubItem,
                      )}
                    >
                      {item.label}
                    </span>
                    {/* TODO: counts (Low stock, Expiring / due) once `data/`
                        covers inventory. The design computes counts for the
                        parent rows too but never renders them, so those stay
                        absent here. */}
                    {item.badge ? (
                      <span
                        className={cx(
                          "text-[11px] font-semibold",
                          isActive ? "text-accent-fg" : "text-text-3",
                        )}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
