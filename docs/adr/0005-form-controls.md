# 5. Form controls: Radix primitives, not shadcn

Date: 2026-08-02

## Status

Accepted. Supersedes the design's native `<select>` for every dropdown in the
app, and supersedes the menu-semantics note at `components/staff/StaffRowMenu.tsx`.

## Context

Every dropdown in the app was a native `<select>`, ported faithfully. The design
specifies exactly that — the donut month picker (`design/LabTrack Dashboard.dc.html`
line 375), the top-consumed period (507), the zone filter (606), the staff tab
(810), rows-per-page (909) and the form fields (1267) are all bare `<select>`
elements with inline styles. Nothing was cut corners on.

The problem is that a `<select>`'s _closed_ box is stylable and its _open_ list
is not. The popup is drawn by the platform, so it ignores the token layer
entirely: wrong family, wrong radius, wrong row height, and a disclosure arrow
that differs per browser. Worst of all it does not follow the theme — on several
platforms the option list stays light while the app around it is dark, which is
the single most visible unfinished edge in the UI.

Three menus had the same shape of problem from the other direction.
`StaffRowMenu` and `SupplierRowMenu` were built on the popover API with
`getBoundingClientRect` measured on open, and `UserMenu` on its own effect-based
dismissal. They work, and the popover choice was well reasoned — the top layer
is genuinely the right answer to a menu being clipped by the table's
`overflow-x`. But a viewport-measured popover cannot follow the row it belongs
to, so all three close on scroll rather than staying anchored.

## Decision

**Radix primitives, styled with our own tokens.** `@radix-ui/react-select` 2.3.7
and `@radix-ui/react-dropdown-menu` 2.1.24, unstyled, dressed in the same class
strings the rest of the app uses.

This is the second half of a two-part decision. The first half is what we did
**not** do.

## Why not shadcn

shadcn was the obvious candidate and is the wrong fit here, for three reasons
that are specific to this codebase rather than general objections to it.

**1. The token vocabulary collides semantically.** `app/globals.css` already
defines `--muted` and `--accent`, and `@theme inline` exposes them app-wide as
`bg-muted` and `bg-accent`. They do not mean what shadcn means by those names:

| Token      | Here                                | shadcn                                                 |
| ---------- | ----------------------------------- | ------------------------------------------------------ |
| `--muted`  | a hover grey (`#f5f6f8`)            | a surface, paired with `--muted-foreground`            |
| `--accent` | the brand indigo _fill_ (`#3b4acc`) | a subtle hover tint, paired with `--accent-foreground` |

Adopting shadcn's sheet means either renaming ours at every call site in the app
or maintaining a translation layer between two vocabularies that share names.

**2. Its dark theme would be dead on arrival.** The theme here is an explicit
user choice written to `data-theme` on `<html>` by `ThemeToggle`, and the variant
is declared as `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *))`.
`shadcn init` writes a `.dark { … }` block, which nothing in this app ever sets.
Every shadcn component would render its light theme permanently, and the failure
is silent — it looks like the components simply don't support dark mode.

_Radix has no equivalent trap: portalled content mounts into `<body>`, which is a
descendant of `<html data-theme="dark">`, so the variant reaches it unchanged._

**3. It ships lucide, and [0002](0002-icons.md) says Heroicons.** Every shadcn
component imports `lucide-react` for its chevrons, checks and ellipses. Taking
them as generated would put a fourth icon hand in a tree that already carefully
mixes two and documents why.

There is a fourth, smaller reason: shadcn builds variants with
`class-variance-authority`. `components/ui/buttons.ts` deliberately exports plain
class strings instead, because the same styles have to go on a `<button>`, a
`<Link>` and a submit without wrapping any of them. A variants library would be
a third way of expressing the same thing. (`tailwind-variants` is already in
`package.json` and used in zero files — evidence of how that goes.)

None of this makes shadcn bad. It makes it a design system, and this app already
has one.

## Menu semantics: a reversal

`StaffRowMenu` previously carried this note, and it was right on its own terms:

> Plain links rather than `role="menu"`/`menuitem`: that contract owes a screen
> reader arrow-key navigation and focus management, and Tab through ordinary
> links is honest about what this does.

The menus now use `DropdownMenu`, which **is** that contract — `role="menu"`,
`role="menuitem"`, arrow keys, typeahead, focus return to the trigger on close.

The reasoning has not been overturned so much as satisfied. The original choice
was between an honest set of links and a menu contract we would have had to
implement by hand and would probably have implemented incompletely. Radix
implements it fully, so the trade the comment was refusing is no longer on the
table.

## Consequences

**Dropdowns are JS-only now.** A Radix Select is a listbox built from divs; with
JS off there is nothing there. This costs less than it appears: `ItemForm`'s
category select renames two fields and switches the date between a shelf life and
a calibration through React state, `EntryForm`'s kind select drives conditional
fields, and both photo fields are `FileReader`-only. Those forms already did not
submit correctly without JS. Radix's `name` prop still emits a hidden native
input, so the server actions receive the same `FormData` as before.

**`NavSelect` keeps its contract.** It still takes options carrying `href` and
pushes on change, so all seven call sites — `ScheduleHeader` ×3, `StaffToolbar`
×2, `InventoryFilters` ×2 — are untouched. Only its internals changed.

**Two new dependencies, and their transitive Radix packages.** Both are MIT
(WorkOS, <https://radix-ui.com>). They are the first Radix in the tree; further
primitives should be reached for on the same terms — behaviour we would
otherwise implement badly, not styling we already have.

## Divergence from the design snapshot

`design/LabTrack Dashboard.dc.html` still specifies native `<select>` for every
dropdown, and per `docs/agents/design.md` the snapshot is never hand-edited.
**This divergence is intentional and the code wins here.** The closed-state box
keeps the design's dimensions — 34px tall, 9px radius, 12.5px text — so the
layout the design specifies is unchanged. What diverges is the popup, which the
design never actually drew: a native `<select>` in a mockup is a placeholder for
"a dropdown goes here", not a considered choice of the platform's rendering.
