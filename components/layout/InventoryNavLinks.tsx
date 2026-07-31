"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { cx } from "@/utils/cx";
import {
  INVENTORY_CHILDREN,
  activeInventoryChild,
  type NavChild,
} from "./navItems";

/**
 * The Inventory filter links. Which one reads as active depends on the query
 * string, so this is split out from `Sidebar`: `useSearchParams` suspends
 * while a route is prerendered, and only this list needs to wait for it.
 */
export function InventoryNavLinks({ id }: { id: string }) {
  const searchParams = useSearchParams();
  return (
    <InventoryNavList id={id} active={activeInventoryChild(searchParams)} />
  );
}

export function InventoryNavList({
  id,
  active,
}: {
  id: string;
  active: NavChild | null;
}) {
  return (
    <ul
      id={id}
      className="mt-0.5 mr-0 mb-1 ml-[22px] flex flex-col gap-px border-l border-border pl-3"
    >
      {INVENTORY_CHILDREN.map((child) => {
        const isActive = child.href === active?.href;
        return (
          <li key={child.href}>
            <Link
              href={child.href}
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
                  isActive ? "font-bold" : "font-medium",
                )}
              >
                {child.label}
              </span>
              {/* TODO: counts (Low stock, Expiring / due) once `data/` lands. */}
              {child.badge ? (
                <span
                  className={cx(
                    "text-[11px] font-bold",
                    isActive ? "text-accent-fg" : "text-text-3",
                  )}
                >
                  {child.badge}
                </span>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
