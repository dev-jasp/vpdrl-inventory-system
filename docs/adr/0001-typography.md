# 1. Typography: Uncut Sans + Chivo Mono

Date: 2026-08-01

## Status

Accepted.

## Context

The dashboard was set in Manrope, loaded from `next/font/google`. Two things
were wrong with it for this product:

1. Manrope is friendly and geometric. This is an instrument panel for a
   laboratory — it should read as engineered.
2. The brief was explicitly to avoid looking like a generated dashboard.

Nearly every figure on screen is a reading: lot numbers, expiry dates,
quantities on hand, peso amounts. Manrope drew all of them in the same face as
the prose around them.

## Decision

**Uncut Sans** for the interface, **Chivo Mono** for readings.

### Uncut Sans

A Helvetica-adjacent grotesk with tighter apertures. It is not a Google font,
so it is self-hosted: the faces in `app/fonts/` come from
`@fontsource/uncut-sans` (OFL-1.1, Kasper Nordkvist), which repackages
<https://github.com/kaspernordkvist/uncut_sans>. The licence ships beside them
as `UncutSans-LICENSE.txt`. No Reserved Font Name is declared, so no rename
obligation applies.

There is no variable cut. Only the four weights the UI asks for are shipped
(400/500/600/700), latin only, no italics — nothing in the app sets italic
text, and a fifth weight nobody uses is dead payload.

### Chivo Mono

Chosen over the obvious candidates on measurements:

| Mono           | x-height | vs Uncut | ₱   | Weights  |
| -------------- | -------- | -------- | --- | -------- |
| **Chivo Mono** | 0.511em  | **+2%**  | yes | variable |
| Fragment Mono  | 0.524em  | +5%      | yes | 400 only |
| Geist Mono     | 0.530em  | +6%      | yes | variable |
| Azeret/Spline  | 0.544em  | +9%      | no  | variable |
| Martian Mono   | 0.600em  | +20%     | no  | variable |

Uncut Sans has a 0.500em x-height. Chivo Mono is the closest match available,
which is what lets a mono cell sit level with the sans beside it. It is also
the mono companion to Chivo, a grotesk, so the two families share a design
logic rather than merely coexisting.

**Geist Mono was rejected because it is the `create-next-app` default.** It is
the font the Next.js scaffold ships with and every generated Next dashboard
wears it. Whatever its merits, it reads as "not chosen".

Fragment Mono was the sentimental favourite — it descends from Helvetica
Monospaced, the same lineage as a Helvetica-adjacent grotesk — but it ships a
single 400 weight, which cannot carry a headline figure.

## The rule: cells, not words

**A data cell or stat block sets entirely in the mono, unit word included. A
prose sentence containing a number sets entirely in the sans.**

```
mono                        sans
LOT-2291                    in 45 d
2026-11-02                  8 of 41 available
12 bottle                   In 45 days
₱66,100                     40 L on hand · reorder at 12 L
```

No line switches family mid-way. The switch happens at a cell boundary, where
the eye already expects a break. This is the whole point: an earlier cut of
this change set the figure in mono and left the unit in sans, which meant
~15 font switches inside single lines, and it read as noise rather than
precision.

Applying it: put `font-mono` on the cell, not on a `<span>` around a numeral.
If you find yourself wrapping a number inside a sentence, the answer is that
the sentence stays sans.

Form inputs holding a code, date or count are mono too — see the `mono` flag on
`ITEM_FORM_FIELDS` in `lib/inventory/form.ts`. It is deliberately separate from
`numeric`, which is about the phone keypad: a lot number is mono but not
numeric.

## Consequences

**The whole weight scale moved down one step.** This is the consequence that
matters most, and it is not optional — it is what makes the typeface swap
survivable.

The design contains 281 weight declarations and **not one of them is 400**. Its
lightest text anywhere is 500. That is a reasonable scale in Manrope, a
light-stemmed geometric sans where 500 reads as ordinary body text. Uncut Sans
is a grotesk: heavier stems, tighter counters, more ink per glyph. Ported
unchanged, the same numbers made every one of ~173 text elements denser at
once, and the page read as uniformly dark.

So each step drops one notch, which preserves the hierarchy exactly while
lifting ink off the entire page:

| Design | Here            | Sites |
| ------ | --------------- | ----- |
| 500    | `font-normal`   | 58    |
| 600    | `font-medium`   | 33    |
| 700    | `font-semibold` | 73    |
| 800    | headings → 600  | —     |

Body text finally sits at 400 — a weight the design never used and Uncut Sans
ships.

**Headings are 600 against the design's 800.** Uncut Sans stops at 700, so
`font-extrabold` on a heading would silently match down anyway; 600 is where
they land after the shift. Card titles, the page title, item detail and edit
headings, and dialog titles all sit there.

Heading size, tracking and colour are the design's, verified against the
snapshot — 15px/−0.015em, 23px/−0.025em, 26px/−0.03em, every one inheriting
`--text` with no colour of its own. **Weight is the only heading property that
diverges**, and it diverges because the typeface changed underneath it.

**Mono figures keep `font-extrabold`**, the one weight not shifted. Chivo's
variable axis (100–900) genuinely reaches 800, they are a different family with
its own density, and holding them while everything else lightens widens the gap
between a reading and its surroundings. Figures now outweigh card titles, which
suits a dashboard whose job is to show numbers.

**The peso sign is why `latin-ext` is loaded.** Uncut Sans has no U+20B1 at any
weight, and Google's `latin` subset does not carry it either; it lives in
`latin-ext` (U+20AD–20C0). Because money is a data block it sets in Chivo Mono,
which does have it. `subsets` in `next/font/google` controls which faces get a
**preload tag**, not which are declared — listing `latin-ext` is the difference
between the sign painting with its digits and swapping in a beat later, and
peso figures sit above the fold.

Chivo Mono has no `↑`/`↓`. The table sort arrows are in sans column headers,
so this does not bite — but a glyph audit is worth repeating before moving any
symbol into a mono cell.

**Tracking.** The design's negative tracking was tuned for Manrope's wide
geometric letterforms. It is removed from mono figures, where negative tracking
fights the fixed advance the font exists to provide. It is left as-is on sans
headings for now: Uncut Sans is already the tighter face, so those values may
want relaxing, but that is a judgement to make by eye rather than by rule.

## Divergence from the design snapshot

`design/LabTrack Dashboard.dc.html` still specifies Manrope, and per
`docs/agents/design.md` the design is upstream of the code and the snapshot is
never hand-edited. **This divergence is intentional and the code wins here.**
Typography is a global token decision, not a view-level design question, and
the snapshot's value is that it stays a byte-for-byte upstream copy that
re-pulls cleanly.

A future re-pull will still say Manrope. That is expected, not a regression.
If the design is updated upstream to match, this note can go.
