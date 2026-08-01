import { first, oneOf, type RawSearchParams } from "@/lib/shared/params";
import type { Staff } from "@/types/staff";

/**
 * The staff list's state, read off the URL for the same reason the inventory
 * list's is: a narrowed list is somewhere you can send a colleague, and the
 * back button walks back out through the filters.
 *
 * The design holds all of this in component state — `sTab`, `sQ`, `sFull`,
 * `sMode`, `sPage`, `sPer` — so unlike the inventory list there are no param
 * names to inherit from it. These are ours.
 */

/** The design's three tabs, as a select. */
export const GROUP_FILTERS = [
  { value: "all", label: "All staff" },
  { value: "tech", label: "Lab technicians" },
  { value: "support", label: "Support staff" },
] as const;

export type GroupFilter = (typeof GROUP_FILTERS)[number]["value"];

export const VIEW_MODES = ["list", "grid"] as const;
export type ViewMode = (typeof VIEW_MODES)[number];

/** The design's own rows-per-page choices for this list. */
export const PER_PAGE_OPTIONS = [10, 25, 50];

export type StaffQuery = {
  q: string;
  group: GroupFilter;
  /** The design's "Full-time only" chip. */
  fullTime: boolean;
  mode: ViewMode;
  page: number;
  per: number;
};

/** The list as it reads with nothing in the URL — the design's initial state. */
export const DEFAULT_QUERY: StaffQuery = {
  q: "",
  group: "all",
  fullTime: false,
  mode: "list",
  page: 1,
  per: 10,
};

const GROUP_VALUES = GROUP_FILTERS.map((group) => group.value);

/** Anything unrecognised falls back to the default rather than erroring. */
export function parseStaffQuery(params: RawSearchParams): StaffQuery {
  const per = Number(first(params.per));
  const page = Number(first(params.page));

  return {
    q: first(params.q)?.trim() ?? DEFAULT_QUERY.q,
    group: oneOf(first(params.group), GROUP_VALUES, DEFAULT_QUERY.group),
    fullTime: first(params.full) === "1",
    mode: oneOf(first(params.mode), VIEW_MODES, DEFAULT_QUERY.mode),
    page: Number.isInteger(page) && page > 0 ? page : DEFAULT_QUERY.page,
    per: PER_PAGE_OPTIONS.includes(per) ? per : DEFAULT_QUERY.per,
  };
}

/**
 * The staff list with `patch` applied.
 *
 * Only what differs from the default is written, so the unfiltered list stays
 * `/staff` and the link the sidebar draws is the same one an empty toolbar
 * builds. Any change other than paging resets to page 1 — narrowing the list
 * from page 3 would otherwise land you past the end of it.
 */
export function staffHref(query: StaffQuery, patch: Partial<StaffQuery> = {}) {
  const next = { ...query, ...patch };
  if (!("page" in patch)) next.page = 1;

  const params = new URLSearchParams();
  if (next.q) params.set("q", next.q);
  if (next.group !== DEFAULT_QUERY.group) params.set("group", next.group);
  if (next.fullTime) params.set("full", "1");
  if (next.mode !== DEFAULT_QUERY.mode) params.set("mode", next.mode);
  if (next.per !== DEFAULT_QUERY.per) params.set("per", String(next.per));
  if (next.page !== DEFAULT_QUERY.page) params.set("page", String(next.page));

  const search = params.toString();
  return search ? `/staff?${search}` : "/staff";
}

/**
 * Group, employment type and the search box, in the design's order.
 *
 * The search covers name, role, email and phone — the design searches all four,
 * which are the things somebody hunting for a colleague actually has to hand.
 */
export function filterStaff(staff: Staff[], query: StaffQuery) {
  const needle = query.q.toLowerCase();

  return staff.filter((person) => {
    if (query.group !== "all" && person.group !== query.group) return false;
    if (query.fullTime && person.employment !== "Full-time") return false;

    if (!needle) return true;
    return `${person.name} ${person.role} ${person.email} ${person.phone}`
      .toLowerCase()
      .includes(needle);
  });
}

/**
 * What the headline count is counting. The design writes "technician(s)" and
 * "staff member(s)" — a mockup's shorthand rather than something to ship, so
 * the count picks the right word here.
 */
export function countLabel(count: number, group: GroupFilter) {
  if (group === "tech") return count === 1 ? "technician" : "technicians";
  // "Support staff" is already plural, and reads correctly either way.
  if (group === "support") return "support staff";
  return count === 1 ? "staff member" : "staff members";
}
