import type { IconName } from "@/components/ui/Icon";

/**
 * The sidebar's `navDef` from `design/LabTrack Dashboard.dc.html`, translated
 * from the design's `setState` calls to URLs. The Inventory children are the
 * design's `goList(...)` filters, which are searchParams on `/inventory`
 * rather than routes of their own — see `docs/structure.md`.
 */
export type NavChild = {
  label: string;
  href: string;
  /** Count shown on the right of the row. Awaits the `data/` seed datasets. */
  badge?: string;
};

export type NavItem = {
  label: string;
  href: string;
  icon: IconName;
  children?: NavChild[];
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const INVENTORY_CHILDREN: NavChild[] = [
  { label: "All items", href: "/inventory" },
  { label: "Chemicals", href: "/inventory?cat=Chemicals" },
  { label: "Equipment", href: "/inventory?cat=Equipment" },
  { label: "Low stock", href: "/inventory?flag=low" },
  { label: "Expiring / due", href: "/inventory?flag=exp" },
];

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "GENERAL",
    items: [
      { label: "Dashboard", href: "/", icon: "layout-dashboard" },
      {
        label: "Inventory",
        href: "/inventory",
        icon: "package",
        children: INVENTORY_CHILDREN,
      },
    ],
  },
  {
    label: "PEOPLE",
    items: [{ label: "Staff List", href: "/staff", icon: "users" }],
  },
  {
    label: "PROCUREMENT",
    items: [
      { label: "Purchase Orders", href: "/purchase-orders", icon: "clipboard" },
      { label: "Suppliers", href: "/suppliers", icon: "truck" },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { label: "Reports", href: "/reports", icon: "report" },
      { label: "Support", href: "/support", icon: "support" },
    ],
  },
];

/** True when `pathname` is inside the section a top-level nav item points at. */
export function isSectionActive(item: NavItem, pathname: string) {
  if (item.href === "/") return pathname === "/";
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/**
 * Which Inventory filter the current query string represents, as the child's
 * own `href`, or `null` when the filters in the URL match no preset. Reading
 * the URL rather than tracking a selection keeps the filters bookmarkable.
 */
export function activeInventoryChild(search: URLSearchParams): NavChild | null {
  for (const child of INVENTORY_CHILDREN) {
    const params = [...new URLSearchParams(child.href.split("?")[1] ?? "")];
    if (
      params.length > 0 &&
      params.every(([key, value]) => search.get(key) === value)
    ) {
      return child;
    }
  }
  const preset = new Set(
    INVENTORY_CHILDREN.flatMap((child) => [
      ...new URLSearchParams(child.href.split("?")[1] ?? "").keys(),
    ]),
  );
  const filtered = [...preset].some((key) => search.has(key));
  return filtered ? null : INVENTORY_CHILDREN[0];
}
