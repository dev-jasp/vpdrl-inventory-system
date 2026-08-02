import Link from "next/link";

import { StaffSearch } from "@/components/staff/StaffSearch";
import { Icon, type IconName } from "@/components/ui/Icon";
import { NavSelect } from "@/components/ui/NavSelect";
import {
  GROUP_FILTERS,
  type StaffQuery,
  type ViewMode,
  countLabel,
  staffHref,
  staffPath,
} from "@/lib/staff/filters";
import { cx } from "@/utils/cx";

const MODES: { value: ViewMode; icon: IconName; label: string }[] = [
  { value: "list", icon: "list", label: "List view" },
  { value: "grid", icon: "grid", label: "Card view" },
];

/**
 * The count, the group filter, search, the full-time chip and the view toggle,
 * as the design lays them across the top of the staff list. Everything except
 * the search box is a link to the same list read a different way.
 */
export function StaffToolbar({
  query,
  total,
}: {
  query: StaffQuery;
  total: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3.5 pt-5 pb-[18px]">
      <div className="flex items-center gap-2.5 text-text-2">
        <Icon name="users" className="size-5" />
        <span className="text-xl font-semibold tracking-[-0.025em] text-text">
          {total}
        </span>
        <span className="text-[13px] font-medium text-text-4">
          {countLabel(total, query.group)}
        </span>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2.5">
        <NavSelect
          label="Filter by group"
          value={query.group}
          options={GROUP_FILTERS.map((group) => ({
            value: group.value,
            label: group.label,
            href: staffHref(query, { group: group.value }),
          }))}
          className="h-[38px] rounded-[10px]"
        />

        {/* Keyed so that a change to the query from anywhere else — the chip
            below, a back navigation — redraws the box to match the URL. */}
        <StaffSearch key={query.q} query={query} />

        <Link
          href={staffHref(query, { fullTime: !query.fullTime })}
          aria-pressed={query.fullTime}
          className={cx(
            "flex h-[38px] items-center rounded-[10px] border px-3.5 text-[12.5px] font-semibold whitespace-nowrap",
            query.fullTime
              ? "border-tint-blue bg-tint-blue text-accent-fg"
              : "border-border-strong bg-surface text-text hover:bg-muted",
          )}
        >
          Full-time only
        </Link>

        <div className="flex overflow-hidden rounded-[10px] border border-border-strong">
          {MODES.map((mode, index) => {
            const active = query.mode === mode.value;
            return (
              <Link
                key={mode.value}
                href={staffHref(query, { mode: mode.value })}
                aria-label={mode.label}
                aria-current={active ? "true" : undefined}
                className={cx(
                  "grid size-[38px] place-items-center",
                  index > 0 && "border-l border-border-strong",
                  active
                    ? "bg-tint-blue text-accent-fg"
                    : "bg-surface text-text-4 hover:bg-muted",
                )}
              >
                <Icon name={mode.icon} className="size-4" />
              </Link>
            );
          })}
        </div>

        {/* The design opens the form dialog from here; here it is a link to
            `/staff/new`, which the modal slot intercepts into the same
            dialog. */}
        <Link
          href={staffPath("/staff/new", query)}
          className="flex h-[38px] items-center rounded-[10px] bg-[#3b82f6] px-[18px] text-[13px] font-semibold text-white hover:bg-[#2563eb]"
        >
          Add staff
        </Link>
      </div>
    </div>
  );
}
