/**
 * Turn an `Item.photo` disk path into something safe to put in a URL.
 *
 * The vendored assets are named as they were downloaded, and a fair few carry
 * characters a URL cannot take raw: spaces (`Filter-tips-10 µL.jpg`), `µ`, `°`,
 * a U+2212 minus sign (`−80°C-freezer.jpg`), `=`, and — the one that actually
 * breaks rather than merely looks wrong — a literal `%` in
 * `Trypsin-EDTA-0.25%.jpg`, which a browser reads as the start of an escape.
 *
 * Storing the encoded form in `data/items.ts` instead would make the seed data
 * unreadable and impossible to check against the folder, so the paths stay
 * literal there and are encoded here. `ItemPhoto` is the only thing that
 * renders one, which keeps this the single place that has to remember.
 */
export function photoUrl(path: string) {
  // Per segment: `encodeURIComponent` would escape the separators too.
  return path.split("/").map(encodeURIComponent).join("/");
}
