"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import {
  INVENTORY_CHILDREN,
  NAV_GROUPS,
  SCHEDULE_CHILDREN,
  activeChild,
  isSectionActive,
} from "./navItems";

/**
 * The topbar heading. The design shows the active sidebar entry, so on
 * `/inventory` the title follows the filter — "Chemicals", "Low stock" — and
 * falls back to the section name everywhere else.
 */
const TITLES: Record<string, string> = {
  "/inventory/new": "New item",
  "/staff/new": "New staff member",
  "/schedule/new": "New entry",
};

function sectionTitle(pathname: string) {
  const known = TITLES[pathname];
  if (known) return known;
  if (pathname.startsWith("/inventory/")) {
    return pathname.endsWith("/edit") ? "Edit item" : "Item detail";
  }
  if (pathname.startsWith("/staff/")) {
    return pathname.endsWith("/edit") ? "Edit staff" : "Staff profile";
  }
  if (pathname.startsWith("/schedule/")) return "Edit entry";
  // Anything else falls back to the section it sits in, so a route added
  // without a title here reads as its section rather than as "Dashboard".
  const item = NAV_GROUPS.flatMap((group) => group.items).find((candidate) =>
    isSectionActive(candidate, pathname),
  );
  return item?.label ?? "";
}

export function PageTitle() {
  const pathname = usePathname();
  const title = sectionTitle(pathname);

  return (
    // 600 rather than the design's 800 — see `CardTitle`.
    <h1 className="text-[23px] font-semibold tracking-[-0.025em]">
      {pathname === "/inventory" ? (
        <Suspense fallback={title}>
          <InventoryTitle fallback={title} />
        </Suspense>
      ) : pathname === "/schedule" ? (
        <Suspense fallback={title}>
          <ScheduleTitle fallback={title} />
        </Suspense>
      ) : (
        title
      )}
    </h1>
  );
}

/** The same as `InventoryTitle`: the filter names the page when there is one. */
function ScheduleTitle({ fallback }: { fallback: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const child = activeChild(SCHEDULE_CHILDREN, pathname, searchParams);
  const filtered = child && child.href !== SCHEDULE_CHILDREN[0].href;
  return <>{filtered ? child.label : fallback}</>;
}

function InventoryTitle({ fallback }: { fallback: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const child = activeChild(INVENTORY_CHILDREN, pathname, searchParams);
  // "All items" is the unfiltered list, which the design titles "Inventory".
  const filtered = child && child.href !== INVENTORY_CHILDREN[0].href;
  return <>{filtered ? child.label : fallback}</>;
}
