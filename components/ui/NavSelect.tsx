"use client";

import { useRouter } from "next/navigation";

import { Select } from "@/components/ui/Select";

export type NavSelectOption = {
  value: string;
  label: string;
  /** Where picking this option goes. */
  href: string;
};

/**
 * A dropdown that navigates instead of holding state. Each option carries the
 * URL it stands for, so the logic that decides what a choice means stays on the
 * server and the only thing shipped to the browser is the push.
 *
 * The chrome is `Select`; this adds only the push, which is the whole reason
 * the two are separate — a form field posts its value, this one goes somewhere.
 */
export function NavSelect({
  label,
  value,
  options,
  className,
  align,
}: {
  /** Accessible name — these selects sit in toolbars with no visible label. */
  label: string;
  value: string;
  options: NavSelectOption[];
  /** Height and corner radius are the caller's: the design rounds this one
      fully in the filter bar and to 9px in the pager. */
  className?: string;
  align?: "start" | "end";
}) {
  const router = useRouter();

  return (
    <Select
      label={label}
      value={value}
      align={align}
      options={options}
      onValueChange={(next) => {
        const picked = options.find((option) => option.value === next);
        if (picked) router.push(picked.href);
      }}
      className={className}
    />
  );
}
