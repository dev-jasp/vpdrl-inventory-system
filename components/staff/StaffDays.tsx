import { DAY_NAMES } from "@/lib/staff/schedule";
import type { WorkingDays } from "@/types/staff";
import { cx } from "@/utils/cx";

/** Spoken form of the rota, since "T" and "S" each stand for two days. */
const SPOKEN = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/**
 * A weekly rota as seven dots, filled on the days worked.
 *
 * The letters are ambiguous read aloud, so the whole row carries one readable
 * summary and the dots themselves are decoration.
 */
export function StaffDays({ days }: { days: WorkingDays }) {
  const worked = SPOKEN.filter((_, index) => days[index] === "1");

  return (
    <span
      role="img"
      aria-label={
        worked.length > 0 ? `Works ${worked.join(", ")}` : "No days assigned"
      }
      className="flex gap-[5px]"
    >
      {DAY_NAMES.map((letter, index) => (
        <span
          key={letter}
          aria-hidden
          className={cx(
            "grid size-6 flex-none place-items-center rounded-full text-[9.5px] font-semibold",
            days[index] === "1"
              ? "bg-[#3b82f6] text-white"
              : "bg-muted text-text-4",
          )}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}
