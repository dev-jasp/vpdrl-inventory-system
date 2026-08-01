/**
 * One page of a list.
 *
 * Both lists paginate the same way and both read `page` and `per` off the URL,
 * where a stale link or a hand-typed number has to be survivable — so the
 * clamping lives here rather than once per list.
 */
export type PageRequest = { page: number; per: number };

export function paginate<T>(rows: T[], { page, per }: PageRequest) {
  const pages = Math.max(1, Math.ceil(rows.length / per));
  // Clamped rather than trusted: `?page=99` should show the last page, and a
  // filter that shrinks the list shouldn't be able to strand you on an empty
  // one either.
  const current = Math.min(Math.max(page, 1), pages);

  return {
    page: current,
    pages,
    total: rows.length,
    rows: rows.slice((current - 1) * per, current * per),
  };
}
