# 2. Icons: Heroicons for the nav and system chrome

Date: 2026-08-02

## Status

Accepted. Supersedes the design's glyph table for the nine icons listed below.

## Context

The design draws its own icons. `design/LabTrack Dashboard.dc.html` carries a
27-entry `glyphs` table of hand-drawn 24×24 geometry (line 1483) and paints each
one as a CSS mask over a solid colour rather than as inline SVG (line 1518), so
an icon inherits whatever `color` its container sets. `components/ui/Icon.tsx`
was a verbatim port of both.

Two things followed from a bespoke set:

1. **It is incomplete for the app as built.** There is no ellipsis glyph, so the
   design's row menus draw a literal `⋯` character in an 800-weight span — which
   is a text node pretending to be an icon, and sizes and aligns like one.
2. **Some glyphs are simplified past the point of reading.** `support` is two
   concentric circles, which reads as a target rather than as help. `package` is
   a box with a cross through it.

## Decision

**Heroicons outline** for the navigation, the notification bell, and the row
menu — nine glyphs, replacing eight of the design's and adding one it lacked:

| Key                | Surface              | Heroicon                  |
| ------------------ | -------------------- | ------------------------- |
| `layout-dashboard` | Dashboard nav        | `rectangle-group`         |
| `package`          | Inventory nav        | `cube`                    |
| `users`            | Staff nav, toolbar   | `user-group`              |
| `clipboard`        | Purchase Orders nav  | `clipboard-document-list` |
| `truck`            | Suppliers nav        | `truck`                   |
| `report`           | Reports nav          | `chart-bar`               |
| `support`          | Support nav          | `rocket-launch`           |
| `bell`             | Topbar notifications | `bell-alert`              |
| `ellipsis`         | Staff row menu (new) | `ellipsis-horizontal`     |

Heroicons is MIT-licensed (Tailwind Labs, <https://heroicons.com>). The path data
is embedded in `GLYPHS`; the licence notice travels with this ADR rather than as
a vendored file, since no Heroicons source file is copied into the tree.

**Keys are semantic slots, not drawing names.** `package` is a cube now and
`support` is a rocket; the key names the place the icon appears, so renaming them
to match the artwork would churn every call site for nothing.

## Stroke weight is a property of the glyph, not of the set

The design renders every icon at `stroke-width: 1.7`, which suits geometry built
from rects and lines. Heroicons outline is drawn for **1.5** and carries far more
detail — the rocket's exhaust, the clipboard's three list dots, the truck's two
wheel arcs. At 1.7 those close-set strokes fill in at the 17px the sidebar uses.

So `maskUrl` picks the width per glyph from a `HEROICONS` set. The design's own
coarser geometry keeps its 1.7 unchanged.

## What does not change

The mask pipeline is the design's and stays: one `<span>` with `bg-current` and a
`mask-image` data URI, memoised per glyph. Icons still tint themselves from the
surrounding text colour, which is what makes the active nav row work.

The other 19 entries in `GLYPHS` — `flask`, `microscope`, `sun`, `moon`, `check`,
`chevron`, `panel`, `logout`, `list`, `grid` and the rest — remain the design's,
at the design's stroke weight.

## Consequences

**The set is deliberately mixed.** Nine Heroicons sit beside nineteen design
glyphs. They are near neighbours in construction (24×24, stroked, round caps and
joins, no fill) so they read as one family, but they are not the same hand.

**New icons should come from Heroicons outline** and be added to `HEROICONS` so
they get the 1.5 stroke. Reach for the design's set only to keep an existing
glyph consistent with itself.

**The staff row menu is no longer a text character.** `StaffRowMenu` renders
`<Icon name="ellipsis" className="size-[18px]" />`, and the button dropped the
`text-base leading-none font-semibold` that existed only to draw the `⋯`.

## Divergence from the design snapshot

`design/LabTrack Dashboard.dc.html` still carries the original glyph table, and
per `docs/agents/design.md` the design is upstream of the code and the snapshot
is never hand-edited. **This divergence is intentional and the code wins here**,
on the same grounds as the typography in [0001](0001-typography.md): the icon set
is a global token decision rather than a view-level design question, and the
snapshot's value is that it stays a byte-for-byte upstream copy that re-pulls
cleanly.

A future re-pull will still carry the old glyphs. That is expected, not a
regression. If the design is updated upstream to match, this note can go.
