"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { INVENTORY_CHILDREN, activeInventoryChild } from "./navItems";

/**
 * The topbar heading. The design shows the active sidebar entry, so on
 * `/inventory` the title follows the filter — "Chemicals", "Low stock" — and
 * falls back to the section name everywhere else.
 */
const TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/inventory": "Inventory",
  "/inventory/new": "New item",
  "/purchase-orders": "Purchase Orders",
  "/staff": "Staff List",
  "/suppliers": "Suppliers",
  "/reports": "Reports",
  "/support": "Support",
};

function sectionTitle(pathname: string) {
  const known = TITLES[pathname];
  if (known) return known;
  if (pathname.startsWith("/inventory/")) {
    return pathname.endsWith("/edit") ? "Edit item" : "Item detail";
  }
  return "Dashboard";
}

export function PageTitle() {
  const pathname = usePathname();
  const title = sectionTitle(pathname);

  return (
    <h1 className="text-[23px] font-extrabold tracking-[-0.025em]">
      {pathname === "/inventory" ? (
        <Suspense fallback={title}>
          <InventoryTitle fallback={title} />
        </Suspense>
      ) : (
        title
      )}
    </h1>
  );
}

function InventoryTitle({ fallback }: { fallback: string }) {
  const searchParams = useSearchParams();
  const child = activeInventoryChild(searchParams);
  // "All items" is the unfiltered list, which the design titles "Inventory".
  const filtered = child && child.href !== INVENTORY_CHILDREN[0].href;
  return <>{filtered ? child.label : fallback}</>;
}
