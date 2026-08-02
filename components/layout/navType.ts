/**
 * The sidebar's type scale — one recipe per rung of the nav hierarchy.
 *
 * Class strings rather than components, on the same grounds as
 * `components/ui/buttons.ts`: these go on a `<span>` inside a `<Link>`, on a
 * heading `<div>`, and on a sub-list heading, without wrapping any of them.
 *
 * The nav has three levels — group label, item, sub-item — and they were sized
 * apart: 10px headings, a 14.5px item, a 12.5px sub-item. That stacked a third
 * depth cue on top of the indent and the rail, and it made a sub-item read as
 * a footnote to its parent rather than as a sibling of it.
 *
 * **A sub-item is the same size as the item above it.** Weight and colour carry
 * the nesting; size does not. Two sizes total, 15px for anything you click and
 * 12px for anything that only labels a run of them.
 *
 * The two 12px headings are deliberately close but not identical — same size,
 * but the sub-label drops a weight step, halves the tracking and lightens to
 * `--text-3`, so GENERAL and CATEGORIES are told apart side by side without
 * either one shouting. Weights are absolute CSS values, already stepped down
 * for Uncut Sans per `docs/adr/0001-typography.md`.
 */

/** A top-level group heading: GENERAL, PEOPLE, PROCUREMENT, SYSTEM. */
export const navGroupLabel =
  "text-[12px] font-medium tracking-[0.06em] text-text-4 uppercase";

/**
 * A top-level row's label. No colour of its own — the row sets it, because the
 * icon beside it has to tint to the same thing.
 */
export const navItemLabel = "text-[15px] font-medium";

/** A heading inside an expanded item's sub-list: CATEGORIES, STATUS. */
export const navSubLabel =
  "text-[12px] font-normal tracking-[0.03em] text-text-3 uppercase";

/** A sub-list entry: All items, Chemicals, Low stock. */
export const navSubItem = "text-[15px] font-normal text-text-2";

/**
 * The sub-list entry the URL currently represents. No pill — that is the
 * top-level row's state, and repeating it here flattens the two levels. This
 * one is weight, colour and the rail segment beside it.
 */
export const navSubItemActive = "text-[15px] font-medium text-accent-fg";
