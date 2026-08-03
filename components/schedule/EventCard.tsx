import Link from "next/link";

import { Icon, type IconName } from "@/components/ui/Icon";
import { windowLabel } from "@/lib/schedule/events";
import { KIND_LABELS, type ScheduleEvent, type Tone } from "@/types/schedule";
import { cx } from "@/utils/cx";

/**
 * One event, drawn three ways: as a block in the day grid, as a row in the
 * all-day band, and as a chip in a week cell. Same anatomy each time — kind
 * glyph, title, window, status pill — sized down as the space shrinks.
 */

/** The kind's glyph. Semantic slots, per `docs/adr/0002-icons.md`. */
const KIND_ICONS: Record<ScheduleEvent["kind"], IconName> = {
  CAL: "hourglass",
  DEL: "truck",
  MTG: "users",
};

/**
 * A tone as the card wears it: a tinted fill, a pill, and a hairline edge.
 *
 * The edge is the tone's own ink at a third strength — one clear step up from
 * the fill it encloses, in the same hue, so the card is outlined rather than
 * flagged. It replaces the 3px coloured bar that used to run down each card's
 * left side. That bar was doing the same job twice: the fill already carries
 * the tone, and a stack of saturated violet and amber tabs down a column read
 * as decoration rather than as meaning. An outline states the same fact at a
 * tenth of the ink.
 *
 * `muted` is the only one not drawn from the `--badge-*` families — nothing in
 * the token set is a neutral badge, and borrowing an amber for "nothing to
 * report" would make it read as a warning. Its edge is the plain border, since
 * there is no hue there to strengthen.
 */
const TONES: Record<Tone, { fill: string; pill: string; edge: string }> = {
  green: {
    fill: "bg-badge-green-bg",
    pill: "bg-badge-green-bg text-badge-green-fg",
    edge: "border-badge-green-fg/35",
  },
  amber: {
    fill: "bg-badge-amber-bg",
    pill: "bg-badge-amber-bg text-badge-amber-fg",
    edge: "border-badge-amber-fg/35",
  },
  red: {
    fill: "bg-badge-red-bg",
    pill: "bg-badge-red-bg text-badge-red-fg",
    edge: "border-badge-red-fg/35",
  },
  violet: {
    fill: "bg-badge-violet-bg",
    pill: "bg-badge-violet-bg text-badge-violet-fg",
    edge: "border-badge-violet-fg/35",
  },
  blue: {
    fill: "bg-tint-blue",
    pill: "bg-tint-blue text-accent-fg",
    edge: "border-accent-fg/35",
  },
  muted: {
    fill: "bg-muted",
    pill: "bg-muted text-text-3",
    edge: "border-border-strong",
  },
};

export function StatusPill({
  tone,
  children,
}: {
  tone: Tone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cx(
        "flex-none rounded-full px-2 py-[3px] text-[10.5px] font-medium whitespace-nowrap",
        TONES[tone].pill,
      )}
    >
      {children}
    </span>
  );
}

/**
 * The block the day grid draws, absolutely positioned by its caller.
 *
 * Everything here is about what fits, and the two thresholds are separate on
 * purpose. Stacked, and counting the edge, the anatomy costs about 31px for
 * the title row, 46px with the window under it and 63px with the supplier line
 * as well. At the grid's hour
 * height the shortest thing anybody books — half an hour — is 48px, so it
 * clears the window and its pill and stops short of a subtitle; anything from
 * 45 minutes up carries the lot. Dropping the status along with the supplier
 * would cost the most useful line to save the least, so the subtitle goes
 * first, and only a block shorter than the grid draws gives up its pill.
 */
export function EventBlock({
  event,
  height,
}: {
  event: ScheduleEvent;
  /** The block's drawn height in pixels, which is what decides its anatomy. */
  height: number;
}) {
  const tone = TONES[event.tone];
  const time = windowLabel(event);
  const showPill = height >= 44;
  const showSubtitle = height >= 68 && event.subtitle;

  return (
    <CardShell
      event={event}
      className={cx(
        "h-full overflow-hidden rounded-[10px] border pr-2 pl-2.5",
        showPill ? "py-[7px]" : "py-1",
        tone.fill,
        tone.edge,
      )}
    >
      <div className="flex items-start gap-1.5">
        <Icon
          name={KIND_ICONS[event.kind]}
          className="mt-px size-[13px] flex-none text-text-2"
        />
        <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-text">
          {event.title}
        </span>
        {showPill ? (
          <StatusPill tone={event.tone}>{event.status}</StatusPill>
        ) : null}
      </div>
      {time ? (
        // A clock reading, so mono — the whole cell, per ADR 0001.
        <div className="mt-0.5 pl-[19px] font-mono text-[11px] font-extrabold tracking-[-0.01em] text-text-2">
          {time}
        </div>
      ) : null}
      {showSubtitle ? (
        <div className="mt-1 truncate pl-[19px] text-[11px] font-normal text-text-3">
          {event.subtitle}
        </div>
      ) : null}
    </CardShell>
  );
}

/**
 * The chip the all-day band draws: one line, no window to show.
 *
 * It sizes to its content rather than filling the band, and the status sits
 * where the text leaves off rather than at the far right. Stretched across a
 * full-width band, four words of content left a tinted slab of empty space
 * with a pill marooned at its edge — the tint stopped reading as a label on a
 * thing and started reading as a coloured row. Hugging the content puts the
 * whole anatomy back under one glance, and lets a quiet day fit its two or
 * three entries on a single line.
 *
 * `max-w-full` is what keeps a long title honest: the chip grows to its text
 * until it reaches the band's width, and the title truncates from there.
 */
export function EventRow({ event }: { event: ScheduleEvent }) {
  const tone = TONES[event.tone];

  return (
    <CardShell
      event={event}
      className={cx(
        "flex max-w-full items-center gap-2 rounded-lg border py-[5px] pr-2 pl-2.5",
        tone.fill,
        tone.edge,
      )}
    >
      <Icon
        name={KIND_ICONS[event.kind]}
        className="size-[13px] flex-none text-text-2"
      />
      <span className="min-w-0 truncate text-[12.5px] font-medium text-text">
        {event.title}
      </span>
      {event.subtitle ? (
        <span className="hidden min-w-0 truncate text-[11.5px] font-normal text-text-3 sm:block">
          {event.subtitle}
        </span>
      ) : null}
      <StatusPill tone={event.tone}>{event.status}</StatusPill>
    </CardShell>
  );
}

/**
 * The chip a week cell draws — a title and one thing on the right, inside the
 * tone's outline. The dot that used to sit on the left went with the day
 * card's bar, for the same reason: at chip size it was a third statement of a
 * tone the fill and the edge already make.
 *
 * That last slot is the window when there is one and the status when there is
 * not, which is what keeps a booked calibration legible: the due date and the
 * booking that satisfies it can both land in the same week, and side by side
 * as bare titles they read as the same thing drawn twice. "Booked" against one
 * and "09:30" against the other says which is which.
 */
export function EventChip({ event }: { event: ScheduleEvent }) {
  const tone = TONES[event.tone];

  return (
    <CardShell
      event={event}
      className={cx(
        "flex items-center gap-1.5 rounded-md border py-1 pr-1.5 pl-2",
        tone.fill,
        tone.edge,
      )}
    >
      <span className="truncate text-[11.5px] font-medium text-text">
        {event.title}
      </span>
      {event.start ? (
        // A clock reading, so mono; a status is prose, so it is not.
        <span className="ml-auto flex-none font-mono text-[10.5px] font-extrabold text-text-3">
          {event.start}
        </span>
      ) : (
        <span className="ml-auto truncate text-[10.5px] font-normal text-text-3">
          {event.status}
        </span>
      )}
    </CardShell>
  );
}

/**
 * The link, or the absence of one. Every card is a link in practice — a
 * derived due date to its item, an entry to its form — but `href` is nullable
 * so a card can exist for something with nowhere to go.
 */
function CardShell({
  event,
  className,
  children,
}: {
  event: ScheduleEvent;
  className?: string;
  children: React.ReactNode;
}) {
  const shared = cx("relative block min-w-0 hover:brightness-[0.97]", className);
  const label = `${KIND_LABELS[event.kind]}: ${event.title}`;

  return event.href ? (
    <Link href={event.href} title={label} className={shared}>
      {children}
    </Link>
  ) : (
    <div title={label} className={shared}>
      {children}
    </div>
  );
}
