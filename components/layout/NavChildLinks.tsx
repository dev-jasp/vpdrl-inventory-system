"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { cx } from "@/utils/cx";
import { activeChild, type NavChild, type NavChildGroup } from "./navItems";

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
    // unbroken past the headings instead of restarting under every one.
    <div
      id={id}
      className="mt-0.5 mr-0 mb-1 ml-[22px] border-l border-border pl-3"
    >
      {groups.map((group, index) => (
        <div key={group.label ?? "ungrouped"}>
          {group.label ? (
            <div
              // The first run carries no heading, so it needs no gap above it.
              className={cx(
                "px-[10px] pb-1 text-[10px] font-normal tracking-[0.13em] text-text-4 uppercase",
                index > 0 && "pt-2",
              )}
            >
              {group.label}
            </div>
          ) : null}
          <ul aria-label={group.label} className="flex flex-col gap-px">
            {group.items.map((item) => {
              const isActive = item.href === active?.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cx(
                      "flex items-center gap-2 rounded-lg px-[10px] py-[7px]",
                      isActive
                        ? "bg-tint-blue text-accent-fg"
                        : "text-text-2 hover:bg-bg",
                    )}
                  >
                    <span
                      className={cx(
                        "flex-1 text-[12.5px] whitespace-nowrap",
                        isActive ? "font-semibold" : "font-normal",
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
