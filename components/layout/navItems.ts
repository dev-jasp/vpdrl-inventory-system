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

type ParsedChildren = {
  children: { child: NavChild; path: string; filters: [string, string][] }[];
  /** Every searchParam any preset in this list pins, e.g. `cat`, `flag`. */
  keys: Set<string>;
};

// Nav lists are module constants, so parse each one once.
const parsed = new WeakMap<NavChild[], ParsedChildren>();

function parse(children: NavChild[]): ParsedChildren {
  const cached = parsed.get(children);
  if (cached) return cached;

  const keys = new Set<string>();
  const entries = children.map((child) => {
    const [path, query = ""] = child.href.split("?");
    const filters = [...new URLSearchParams(query)];
    for (const [key] of filters) keys.add(key);
    return { child, path, filters };
  });

  const result = { children: entries, keys };
  parsed.set(children, result);
  return result;
}

/**
 * Which preset in `children` the current URL represents, or `null` when it
 * matches none. Reading it back off the URL rather than tracking a selection
 * is what keeps the filters bookmarkable.
 *
 * A preset matches only when it pins every filter the URL sets — otherwise
 * `?cat=Chemicals&flag=low` would resolve to plain "Chemicals" — and an
 * unfiltered preset ("All items") matches only a URL with no filters at all.
 */
export function activeChild(
  children: NavChild[],
  pathname: string,
  search: URLSearchParams,
): NavChild | null {
  const { children: entries, keys } = parse(children);
  const filtered = [...keys].some((key) => search.has(key));

  for (const { child, path, filters } of entries) {
    if (path !== pathname) continue;
    if (filters.length === 0) {
      if (!filtered) return child;
      continue;
    }
    const own = new Set(filters.map(([key]) => key));
    const exact = [...keys].every((key) => own.has(key) || !search.has(key));
    if (exact && filters.every(([key, value]) => search.get(key) === value)) {
      return child;
    }
  }
  return null;
}
