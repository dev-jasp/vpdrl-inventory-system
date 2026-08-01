import { first, oneOf, type RawSearchParams } from "@/lib/shared/params";
import type { Category } from "@/types/item";
import type { TrackedItem } from "./summary";

export { paginate } from "@/lib/shared/pagination";
export type { RawSearchParams };

/**
 * Reading the inventory list's state off the URL rather than out of component
 * state is what makes the sidebar's Chemicals / Low stock / Expiring-due
 * entries filters instead of routes, and what makes any view of the list
 * shareable — see `docs/structure.md`.
 *
 * The param names and the sort keys are the design's own (`cat`, `flag`,
 * `zone`, `q`, `sort`, `dir`), so links written against the mockup — the
 * dashboard's "View all" is `?sort=p&dir=-1` — keep working.
 */

/** "Chemicals" is the design's shorthand for reagents and solvents together. */
export const CATEGORY_FILTERS = [
  "All",
  "Chemicals",
  "Reagent",
  "Solvent",
  "Consumable",
  "Equipment",
  "Standard",
] as const;

export type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

export const FLAG_FILTERS = [
  { value: "low", label: "Low stock" },
  { value: "exp", label: "Expiring / due" },
] as const;

export type FlagFilter = (typeof FLAG_FILTERS)[number]["value"];

export const SORT_COLUMNS = [
  { key: "name", label: "ITEM" },
  { key: "cat", label: "CATEGORY" },
  { key: "loc", label: "LOCATION" },
  { key: "qty", label: "ON HAND" },
  { key: "exp", label: "EXPIRY / CAL" },
  { key: "p", label: "STATUS" },
] as const;

export type SortKey = (typeof SORT_COLUMNS)[number]["key"];

export const PER_PAGE_OPTIONS = [10, 25, 50];

export type InventoryQuery = {
  q: string;
  category: CategoryFilter;
  flag: FlagFilter | null;
  zone: string;
  sort: SortKey;
  dir: 1 | -1;
  page: number;
  per: number;
};

/**
 * The list as it reads with nothing in the URL. Sorting by status descending
 * is the design's initial state — the shelf that needs attention first is the
 * first thing on screen.
 *
 * The design paginates the staff list but not this one, so 25 is ours: enough
 * that the full catalogue is two pages rather than five.
 */
export const DEFAULT_QUERY: InventoryQuery = {
  q: "",
  category: "All",
  flag: null,
  zone: "All",
  sort: "p",
  dir: -1,
  page: 1,
  per: 25,
};

/** Anything unrecognised falls back to the default rather than erroring. */
export function parseInventoryQuery(params: RawSearchParams): InventoryQuery {
  const per = Number(first(params.per));
  const page = Number(first(params.page));

  return {
    q: first(params.q)?.trim() ?? DEFAULT_QUERY.q,
    category: oneOf(
      first(params.cat),
      CATEGORY_FILTERS,
      DEFAULT_QUERY.category,
    ),
    flag:
      first(params.flag) === "low"
        ? "low"
        : first(params.flag) === "exp"
          ? "exp"
          : null,
    zone: first(params.zone) || DEFAULT_QUERY.zone,
    sort: oneOf(
      first(params.sort),
      SORT_COLUMNS.map((column) => column.key),
      DEFAULT_QUERY.sort,
    ),
    dir: first(params.dir) === "1" ? 1 : -1,
    page: Number.isInteger(page) && page > 0 ? page : DEFAULT_QUERY.page,
    per: PER_PAGE_OPTIONS.includes(per) ? per : DEFAULT_QUERY.per,
  };
}

/**
 * The list URL with `patch` applied.
 *
 * Only what differs from the default is written, so the unfiltered list stays
 * `/inventory` and a link the sidebar draws stays comparable to the one a chip
 * builds. Any change other than paging resets to page 1 — narrowing the list
 * while sitting on page 4 would otherwise land you past the end of it.
 */
export function inventoryHref(
  query: InventoryQuery,
  patch: Partial<InventoryQuery> = {},
) {
  const next = { ...query, ...patch };
  if (!("page" in patch)) next.page = 1;

  const params = new URLSearchParams();
  if (next.q) params.set("q", next.q);
  if (next.category !== DEFAULT_QUERY.category)
    params.set("cat", next.category);
  if (next.flag) params.set("flag", next.flag);
  if (next.zone !== DEFAULT_QUERY.zone) params.set("zone", next.zone);
  if (next.sort !== DEFAULT_QUERY.sort) params.set("sort", next.sort);
  if (next.dir !== DEFAULT_QUERY.dir) params.set("dir", String(next.dir));
  if (next.per !== DEFAULT_QUERY.per) params.set("per", String(next.per));
  if (next.page !== DEFAULT_QUERY.page) params.set("page", String(next.page));

  const search = params.toString();
  return search ? `/inventory?${search}` : "/inventory";
}

/** The list exactly as `query` describes it, the page it is on included. */
export function listHref(query: InventoryQuery) {
  return inventoryHref(query, { page: query.page });
}

/**
 * An item's detail page, carrying the list state that led to it.
 *
 * The design's "← Back to inventory" drops you back into the list you left,
 * filters and all, because it never left it — the detail is a view swap over
 * the same component state. A route has no such memory, so the way back rides
 * along in the URL.
 */
export function itemHref(query: InventoryQuery, id: string) {
  const [, search] = listHref(query).split("?");
  const path = `/inventory/${encodeURIComponent(id)}`;
  return search ? `${path}?${search}` : path;
}

export function filterItems(items: TrackedItem[], query: InventoryQuery) {
  const needle = query.q.toLowerCase();

  return items.filter((item) => {
    if (query.category === "Chemicals") {
      if (item.category !== "Reagent" && item.category !== "Solvent") {
        return false;
      }
    } else if (
      query.category !== "All" &&
      item.category !== (query.category as Category)
    ) {
      return false;
    }

    if (query.zone !== "All" && item.zone !== query.zone) return false;

    if (
      query.flag === "low" &&
      item.status.kind !== "Low Stock" &&
      item.status.kind !== "Out of Stock"
    ) {
      return false;
    }
    // "Expiring / due" is both the warning and the overdue band, so an item
    // that has already lapsed doesn't drop off the list that chases it.
    if (
      query.flag === "exp" &&
      item.status.priority !== 3 &&
      item.status.priority !== 4
    ) {
      return false;
    }

    if (!needle) return true;
    return `${item.name} ${item.id} ${item.lot} ${item.location} ${item.supplier}`
      .toLowerCase()
      .includes(needle);
  });
}

function sortValue(item: TrackedItem, key: SortKey) {
  switch (key) {
    case "name":
      return item.name;
    case "cat":
      return item.category;
    case "loc":
      return item.location;
    case "qty":
      return item.quantity;
    // Items with no date sort as though they were the furthest away, so
    // "soonest first" doesn't open on a wall of equipment that never expires.
    case "exp":
      return item.expiry ?? "9999-12-31";
    case "p":
      return item.status.priority;
  }
}

export function sortItems(items: TrackedItem[], query: InventoryQuery) {
  // `sort` is stable, so items that tie — most of them, under the default sort
  // by status — hold their seed order. That determinism is what lets a page
  // number mean the same thing on every render.
  return items.slice().sort((a, b) => {
    const left = sortValue(a, query.sort);
    const right = sortValue(b, query.sort);
    if (typeof left === "number" && typeof right === "number") {
      return (left - right) * query.dir;
    }
    return String(left).localeCompare(String(right)) * query.dir;
  });
}

/**
 * Where a header click takes the list: the same column flips direction, a new
 * one opens on its most useful end — biggest first for quantity and status,
 * A–Z for everything else.
 */
export function nextSort(query: InventoryQuery, key: SortKey) {
  if (query.sort === key) return { sort: key, dir: -query.dir as 1 | -1 };
  return { sort: key, dir: (key === "p" || key === "qty" ? -1 : 1) as 1 | -1 };
}

/** Every zone in use, in the order the catalogue introduces them. */
export function zonesOf(items: TrackedItem[]) {
  return ["All", ...new Set(items.map((item) => item.zone))];
}
