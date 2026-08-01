"use client";

import { useRouter } from "next/navigation";

import { cx } from "@/utils/cx";

export type NavSelectOption = {
  value: string;
  label: string;
  /** Where picking this option goes. */
  href: string;
};

/**
 * A `<select>` that navigates instead of holding state. Each option carries
 * the URL it stands for, so the logic that decides what a choice means stays
 * on the server and the only thing shipped to the browser is the push.
 */
export function NavSelect({
  label,
  value,
  options,
  className,
}: {
  /** Accessible name — these selects sit in toolbars with no visible label. */
  label: string;
  value: string;
  options: NavSelectOption[];
  className?: string;
}) {
  const router = useRouter();

  return (
    <select
      aria-label={label}
      value={value}
      onChange={(event) => {
        const picked = options.find(
          (option) => option.value === event.target.value,
        );
        if (picked) router.push(picked.href);
      }}
      // Height and corner radius are the caller's: the design rounds this one
      // fully in the filter bar and to 9px in the pager.
      className={cx(
        "cursor-pointer border border-border-strong bg-surface px-3 text-[12.5px] font-semibold text-text outline-none",
        className,
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
