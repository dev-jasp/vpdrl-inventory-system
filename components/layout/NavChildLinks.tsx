"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { cx } from "@/utils/cx";
import { activeChild, type NavChild } from "./navItems";

/**
 * A nav item's sub-list. Which entry reads as active depends on the query
 * string, so this is split out from `Sidebar`: `useSearchParams` suspends
 * while a route is prerendered, and only this list needs to wait for it.
 */
export function NavChildLinks({
  id,
  items,
}: {
  id: string;
  items: NavChild[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <NavChildList
      id={id}
      items={items}
      active={activeChild(items, pathname, searchParams)}
    />
  );
}

export function NavChildList({
  id,
  items,
  active,
}: {
  id: string;
  items: NavChild[];
  active: NavChild | null;
}) {
  return (
    <ul
      id={id}
      className="mt-0.5 mr-0 mb-1 ml-[22px] flex flex-col gap-px border-l border-border pl-3"
    >
      {items.map((item) => {
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
              {/* TODO: counts (Low stock, Expiring / due) once `data/` covers
                  inventory. The design computes counts for the parent rows too
                  but never renders them, so those stay absent here. */}
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
  );
}
