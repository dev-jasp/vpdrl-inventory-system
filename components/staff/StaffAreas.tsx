import { cx } from "@/utils/cx";

/**
 * Assigned zones, as the design abbreviates them: the first one, then "+N" for
 * the rest. The full list is the `title`, so the count is not a dead end while
 * the profile dialog that would spell it out does not exist.
 *
 * Returns the two spans rather than a box around them — the list and the card
 * arrange them differently.
 */
export function StaffAreas({
  areas,
  className,
}: {
  areas: string[];
  /** Placement for the leading zone; the card pushes it to the right. */
  className?: string;
}) {
  const [main, ...rest] = areas;

  return (
    <>
      <span
        title={areas.length > 1 ? areas.join(", ") : undefined}
        className={cx("truncate text-[12.5px] font-semibold", className)}
      >
        {main ?? "—"}
      </span>
      {rest.length > 0 ? (
        <span className="flex-none text-[12px] font-bold text-accent-fg">
          +{rest.length}
          <span className="sr-only"> more: {rest.join(", ")}</span>
        </span>
      ) : null}
    </>
  );
}
