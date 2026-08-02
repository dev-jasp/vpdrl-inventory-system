import { DAY_LABELS, DAY_NAMES } from "@/lib/staff/schedule";
import type { WorkingDays } from "@/types/staff";
import { cx } from "@/utils/cx";

/**
 * A weekly rota as seven dots, filled on the days worked.
 *
 * The letters are ambiguous read aloud, so the whole row carries one readable
 * summary and the dots themselves are decoration.
 */
export function StaffDays({
  days,
  large,
}: {
  days: WorkingDays;
  /** The profile draws the same rota a size up, as the design does. */
  large?: boolean;
}) {
  const worked = DAY_LABELS.filter((_, index) => days[index] === "1");

  return (
    <span
      role="img"
      aria-label={
        worked.length > 0 ? `Works ${worked.join(", ")}` : "No days assigned"
      }
      className={cx("flex", large ? "gap-1.5" : "gap-[5px]")}
    >
      {DAY_NAMES.map((letter, index) => (
        <span
          key={letter}
          aria-hidden
          className={cx(
            "grid flex-none place-items-center rounded-full font-semibold",
            large ? "size-[26px] text-[10px]" : "size-6 text-[9.5px]",
            days[index] === "1"
              ? "bg-accent text-white"
              : "bg-muted text-text-4",
          )}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}
