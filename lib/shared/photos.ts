/**
 * Turn a `photo` disk path — an item's or a person's — into something safe to
 * put in a URL.
 *
 * The vendored assets are named as they were downloaded, and a fair few carry
 * characters a URL cannot take raw: spaces (`Filter-tips-10 µL.jpg`,
 * `Chen Wei.jpg`), `µ`, `°`, a U+2212 minus sign (`−80°C-freezer.jpg`), `=`,
 * and — the one that actually breaks rather than merely looks wrong — a literal
 * `%` in `Trypsin-EDTA-0.25%.jpg`, which a browser reads as the start of an
 * escape.
 *
 * Storing the encoded form in `data/items.ts` and `data/staff.ts` instead would
 * make the seed data unreadable and impossible to check against the folders, so
 * the paths stay literal there and are encoded here. Shared rather than
 * inventory-local because `Avatar` needs the same treatment for staff
 * headshots.
 */
export function photoUrl(path: string) {
  // A photo attached or captured in a form is already a `data:` URL, not a
  // file on disk. It is its own encoding — escaping it would destroy it.
  if (isDataUrl(path)) return path;
  // Per segment: `encodeURIComponent` would escape the separators too.
  return path.split("/").map(encodeURIComponent).join("/");
}

/** True for a photo carried inline rather than served from `public/`. */
export function isDataUrl(path: string) {
  return path.startsWith("data:");
}
