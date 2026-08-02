/**
 * The shared button recipes.
 *
 * Class strings rather than components, because these same styles have to go
 * on a `<button>`, a `<Link>` and a submit button without wrapping any of them.
 *
 * They exist because the primary recipe was written out at every call site and
 * drifted: three of them moved to the new accent and the rest kept the old one.
 * Changing a button now means changing it here. The fill is `bg-accent`, never
 * a hex — see the token note in `app/globals.css`.
 */

/** Filled, for the one action a screen is really for. */
export const primaryButton =
  "flex h-9.5 items-center rounded-md bg-accent px-4.5 text-[13px] font-medium text-white hover:bg-accent-hover disabled:opacity-60";

/** Outlined, for the way out of something — Cancel, dismiss. */
export const secondaryButton =
  "flex h-9.5 items-center rounded-md border border-border-strong bg-surface px-4 text-[13px] font-medium text-text hover:bg-muted";

/**
 * The focus ring every text input wears: the accent picked up as a border plus
 * a soft halo. `color-mix` keeps the halo tied to the token, so it follows the
 * accent instead of being a hardcoded rgba of whatever the accent used to be.
 */
export const inputFocus =
  "outline-none focus:border-accent focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--accent)_22%,transparent)]";
