import Link from "next/link";

import { Icon } from "@/components/ui/Icon";
import { NavSelect } from "@/components/ui/NavSelect";
import { cx } from "@/utils/cx";

const stepClass =
  "grid size-[34px] flex-none place-items-center rounded-full border border-border-strong bg-surface text-text-2";

/**
 * The pager: how many rows, where you are, and a step either way.
 *
 * No page numbers. The design draws a numbered row, and with three per-page
 * options over 41 items the highest this app can reach is five — few enough
 * that a numbered row is mostly empty gesture, and not few enough to be worth
 * the truncation logic a longer list would need. The range text already says
 * where you are, so the numbers were saying it twice.
 *
 * Every step is a link, so a page is somewhere you can be sent rather than a
 * state you have to arrive at by clicking. What a step *means* is the caller's
 * — each list builds its own URLs — which is all `href` is.
 */
export function Pagination({
  label,
  page,
  pages,
  total,
  per,
  perOptions,
  href,
  empty,
}: {
  /** Accessible name for the nav, e.g. "Inventory pages". */
  label: string;
  /** Clamped page, which may differ from the one asked for in the URL. */
  page: number;
  pages: number;
  total: number;
  per: number;
  perOptions: number[];
  href: (patch: { page?: number; per?: number }) => string;
  /** What to say in place of a range when nothing matched. */
  empty: string;
}) {
  const from = (page - 1) * per + 1;
  const to = Math.min(page * per, total);

  return (
    <nav
      aria-label={label}
      className="mt-[18px] flex flex-wrap items-center gap-3"
    >
      <span className="text-[12.5px] font-medium text-text-3">
        Rows per page
      </span>
      <NavSelect
        label="Rows per page"
        value={String(per)}
        options={perOptions.map((option) => ({
          value: String(option),
          label: String(option),
          href: href({ per: option }),
        }))}
        className="h-[34px] rounded-[9px] px-2.5"
      />

      <div className="ml-auto flex items-center gap-3">
        <span className="text-[12.5px] font-medium text-text-4">
          {total === 0 ? empty : `${from}–${to} of ${total}`}
        </span>

        <div className="flex items-center gap-2">
          <Step
            to={href({ page: page - 1 })}
            disabled={page === 1}
            rel="prev"
            label="Previous page"
            // The chevron is drawn pointing down; a quarter turn clockwise
            // aims it left.
            spin="rotate-90"
          />
          <Step
            to={href({ page: page + 1 })}
            disabled={page === pages}
            rel="next"
            label="Next page"
            spin="-rotate-90"
          />
        </div>
      </div>
    </nav>
  );
}

/**
 * A step, as a link when there is somewhere to go and a disabled button when
 * there is not — rather than a styled `<span>`, which looks like a control a
 * screen reader is never told about and the keyboard cannot reach.
 */
function Step({
  to,
  disabled,
  rel,
  label,
  spin,
}: {
  to: string;
  disabled: boolean;
  rel: "prev" | "next";
  label: string;
  spin: string;
}) {
  const glyph = <Icon name="chevron" className={cx("size-4", spin)} />;

  if (disabled) {
    return (
      <button type="button" disabled className={cx(stepClass, "opacity-40")}>
        {glyph}
        <span className="sr-only">{label}</span>
      </button>
    );
  }

  return (
    <Link href={to} rel={rel} className={cx(stepClass, "hover:bg-muted")}>
      {glyph}
      <span className="sr-only">{label}</span>
    </Link>
  );
}
