import { ITEMS } from "@/data/items";
import type { Item } from "@/types/item";

/**
 * The item collection, standing in for the API the way `data/` stands in for
 * its seed. Every read path goes through here rather than importing `ITEMS`
 * directly, so the form has something to write to.
 *
 * It is module state: it lives as long as the server process, is not shared
 * between instances, and resets on restart — so a saved item survives a
 * navigation and a refresh, but not a rebuild. That is the honest limit of a
 * repo with no backend, and this module is the single seam to replace when
 * there is one.
 */
let items: Item[] = ITEMS.map((item) => ({ ...item }));

export function allItems(): Item[] {
  return items;
}

export function findItem(id: string) {
  return items.find((item) => item.id === id);
}

/** New items go to the top, as they do in the design. */
export function upsertItem(item: Item) {
  const index = items.findIndex((existing) => existing.id === item.id);
  items =
    index >= 0
      ? items.map((existing, at) => (at === index ? item : existing))
      : [item, ...items];
  return item;
}

/** Every zone in use, for the form's zone picker. */
export function knownZones() {
  return [...new Set(items.map((item) => item.zone))];
}
