import Link from "next/link";

import { Icon } from "@/components/ui/Icon";
import { NavSelect } from "@/components/ui/NavSelect";
import { primaryButton } from "@/components/ui/buttons";
import {
  ANY_OWNER,
  DEFAULT_QUERY,
  NO_OWNER,
  newEntryHref,
  scheduleHref,
  stepHref,
  type ScheduleQuery,
} from "@/lib/schedule/filters";
import { fromISO, isoDate, weekOf } from "@/lib/shared/dates";
import { KIND_LABELS, SCHEDULE_KINDS } from "@/types/schedule";
import type { Staff } from "@/types/staff";
import { cx } from "@/utils/cx";

/**
 * The calendar's controls, in the order the reference screenshot puts them:
 * what is in view on the left, how to look at it on the right.
 *
 * Locales are pinned for the same reason `lib/shared/dates.ts` pins its own —
 * the server and the browser must not disagree and trip hydration.
 */
const dayFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const spanStart = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
});

const spanEnd = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function viewLabel(query: ScheduleQuery) {
  const anchor = fromISO(query.date);
  if (query.view === "day") return dayFormat.format(anchor);
  const days = weekOf(anchor);
  return `${spanStart.format(days[0])} – ${spanEnd.format(days[6])}`;
}

export function ScheduleHeader({
  query,
  staff,
  count,
  onDutyCount,
}: {
  query: ScheduleQuery;
  staff: Staff[];
  /** Events in view, which is what the count on the left reports. */
  count: number;
  onDutyCount: number;
}) {
  const today = isoDate(fromISO(DEFAULT_QUERY.date));
  const isToday = query.date === today && !query.backlog;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2.5">
      <Icon name="calendar" className="size-[18px] flex-none text-text-3" />
      <p className="text-[13px] font-normal text-text-3">
        {/* A count is a reading; the unit word rides in the mono cell with it,
            per `docs/adr/0001-typography.md`. */}
        <span className="font-mono text-[13px] font-extrabold text-text">
          {count}
        </span>{" "}
        {query.backlog
          ? "awaiting a window"
          : `${count === 1 ? "event" : "events"} · ${onDutyCount} on duty`}
      </p>

      {query.backlog ? null : (
        <>
          <Link
            href={scheduleHref(query, { date: today })}
            aria-current={isToday ? "date" : undefined}
            className={cx(
              "ml-1 flex h-[38px] items-center rounded-md border border-border-strong px-3.5 text-[12.5px] font-medium hover:bg-muted",
              isToday ? "bg-tint-blue text-accent-fg" : "bg-surface text-text",
            )}
          >
            Today
          </Link>

          <div className="flex items-center gap-1">
            <StepLink href={stepHref(query, -1)} query={query} back />
            <StepLink href={stepHref(query, 1)} query={query} />
          </div>

          <p className="text-[14px] font-medium tracking-[-0.01em]">
            {viewLabel(query)}
          </p>
        </>
      )}

      <div className="ml-auto flex flex-wrap items-center gap-2">
        {query.backlog ? null : (
          <div className="flex items-center rounded-md border border-border-strong bg-surface p-0.5">
            {(["day", "week"] as const).map((view) => (
              <Link
                key={view}
                href={scheduleHref(query, { view })}
                aria-current={query.view === view ? "true" : undefined}
                className={cx(
                  // h-8 inside the 2px border and the 2px padding is what
                  // brings the whole control to the toolbar's 38px.
                  "flex h-8 items-center rounded-[5px] px-3 text-[12.5px] font-medium capitalize",
                  query.view === view
                    ? "bg-tint-blue text-accent-fg"
                    : "text-text-2 hover:bg-muted",
                )}
              >
                {view}
              </Link>
            ))}
          </div>
        )}

        <NavSelect
          label="Filter by kind"
          value={query.kind ?? "All"}
          className="h-[38px] rounded-md"
          options={[
            { value: "All", label: "All kinds", href: scheduleHref(query, { kind: null }) },
            ...SCHEDULE_KINDS.map((kind) => ({
              value: kind,
              label: `${KIND_LABELS[kind]}s`,
              href: scheduleHref(query, { kind }),
            })),
          ]}
        />

        <NavSelect
          label="Filter by owner"
          value={query.owner}
          className="h-[38px] rounded-md"
          options={[
            {
              value: ANY_OWNER,
              label: "All staff",
              href: scheduleHref(query, { owner: ANY_OWNER }),
            },
            {
              value: NO_OWNER,
              label: "Unassigned",
              href: scheduleHref(query, { owner: NO_OWNER }),
            },
            ...staff.map((person) => ({
              value: person.id,
              label: person.name,
              href: scheduleHref(query, { owner: person.id }),
            })),
          ]}
        />

        {/* The recipe's own height and padding, unqualified. The `h-8 px-3.5`
            that used to sit in front of it never applied — Tailwind orders its
            output, not the class string — so this button was always the 38px
            the rest of the toolbar has now been brought up to. */}
        <Link href={newEntryHref(query)} className={primaryButton}>
          + New entry
        </Link>
      </div>
    </div>
  );
}

function StepLink({
  href,
  query,
  back,
}: {
  href: string;
  query: ScheduleQuery;
  back?: boolean;
}) {
  const unit = query.view === "week" ? "week" : "day";
  const label = `${back ? "Previous" : "Next"} ${unit}`;

  return (
    <Link
      href={href}
      title={label}
      aria-label={label}
      className="grid size-[38px] place-items-center rounded-md border border-border-strong bg-surface text-text-2 hover:bg-muted"
    >
      {/* One chevron glyph, turned. The design ships no left/right pair. */}
      <Icon
        name="chevron"
        className={cx("size-[15px]", back ? "rotate-90" : "-rotate-90")}
      />
    </Link>
  );
}
