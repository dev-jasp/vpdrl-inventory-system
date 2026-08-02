# 3. Reports: an analytics band, and CSV as the only format

Date: 2026-08-02

## Status

Accepted.

## Context

The design's Reports view (`isReports` in `design/LabTrack Dashboard.dc.html`)
is one thing: a responsive grid of six cards built from `reportsRaw`. Each card
carries a name, a description, a period, a coloured format badge — PDF, XLSX or
CSV — and a line reading "Generated 2026-07-28 · 1.2 MB" beside a Download
button. The button has no handler. Nothing on the page is plotted.

Two things about that do not survive contact with a working app.

**The Download button is the whole point of the page and it does nothing.** A
report nobody can open is a card with a name on it.

**The sizes and formats describe documents this repo cannot produce.** "1.2 MB"
and "PDF" were plausible numbers in a mockup. Here they would sit beside a
button that either does nothing or hands over something that is not a PDF and is
not 1.2 MB.

## Decision

### The card grid is the design's

Ported as drawn: `reportsRaw` becomes `data/reports.ts`, the layout and every
string are the design's, and the format badge, period line and generated line
all stay.

### Downloads generate real files

`lib/reports/generate.ts` builds each report from the same stores the screens
read, and `app/(dashboard)/reports/[reportId]/download/route.ts` serves it.

A route handler rather than a click handler assembling a Blob, so Download stays
an ordinary `<a download>`: it works before hydration, is keyboard-reachable,
and can be middle-clicked or copied as a link. That is the same reasoning that
keeps the inventory, staff and supplier rows real links.

Because the reports are generated per request, a report downloaded after an item
is saved contains that item.

### Every report is a CSV

The design's three formats become one. A CSV is what this app can honestly
produce from its own data; a PDF or an XLSX needs a writer library and would
otherwise mean a badge reading "PDF" over a file that is not one.

The consequence is visible: the design's `fmtColor` map painted the badges
amber, green and blue, and six CSV badges are all blue. That variety was
decoration on a mockup's file-type field. `ReportFormat` stays a union with one
member so adding a real writer later is a type change rather than a rewrite.

### The seeded file sizes are gone

Each card's size is measured from the bytes the download actually produces
(`reportSize`). The number on the card is therefore true by construction, and it
moves when the catalogue does.

This is why `/reports` is `force-dynamic`: rendering the page means generating
six reports from stores that change under it.

### An analytics band above the grid

Four stat tiles and two charts, which the design does not have.

They report the ground the six reports cover — the compliance horizon and
supplier delivery — computed in `lib/reports/analytics.ts` from the same stores
the CSVs are generated from, so a figure on screen and the same figure in a
downloaded file cannot disagree. Nothing here is a second source of truth.

They deliberately do **not** duplicate the dashboard. Consumption over time and
stock distribution already have cards on `/`; repeating them here would be a
second dashboard rather than a reports page.

## Form and colour

Per the visualization method, the form comes from the data's job and colour is
assigned last and validated rather than eyeballed.

**Stat tiles, not charts, for the four headline figures.** Each is a single
number with no dimension to plot against.

**The horizon is columns in one hue.** Its buckets are an ordered scale, so
position already identifies them and a second encoding in colour would be
decoration. The 30-day boundary is not invented here: it is the threshold
`statusOf` already uses to call something Expiring Soon or Cal. Due, so the
second column is exactly the set of items the app flags. Only the overdue count
takes a colour — the red text token, the same one the item lists use for the
same fact.

**On-time delivery is horizontal bars in one hue, on a 0–100 axis.** Horizontal
because the labels are supplier names. One series, so no legend — the title
names the measure. The axis starts at zero: with every supplier between 90% and
99%, a truncated axis would turn a six-point spread into a landslide. The
percentage takes the band's colour and the band is written out in words beside
it, exactly as the supplier table draws it.

**The palette was validated, not eyeballed.** The four status fills the horizon
first reached for (`#dc2626`, `#8b5cf6`, `#f59e0b`, `#10b981`) pass every check
on the light surface but **fail the lightness band on the dark one**, and the
app's dark badge tokens — which are text colours — fail three checks as a
categorical fill set: they are pastel, close in lightness, and the violet reads
as gray. That result is what drove both charts to a single hue, which needs no
categorical separation in either theme. `lib/suppliers/performance.ts` had
already reached the same conclusion for the same reason.

## Consequences

**`/reports` is dynamic where `/suppliers` is static.** It has to be: the page
generates six files to weigh them.

**Purchase orders have no record type.** The Purchase Order Log is assembled
from each item's synthetic "Received … · PO ####" activity entry — the only
place the app knows about a purchase order — so it reports exactly what the item
detail already shows, rather than inventing a parallel fiction. It is the report
to regenerate first when purchase orders become real.

**The page has no h1 of its own.** `PageTitle` renders "Reports" in the topbar
already; the design pairs its title with the "Generated summaries…" line because
the design has no topbar title.

## Divergence from the design snapshot

`design/LabTrack Dashboard.dc.html` still draws six cards, three format colours
and a dead button, and per `docs/agents/design.md` the design is upstream of the
code and the snapshot is never hand-edited. **The divergence is intentional and
the code wins here**, on the same grounds as [0001](0001-typography.md) and
[0002](0002-icons.md).

Unlike those two, part of this one is a genuine gap rather than a preference: a
mockup can draw a Download button that does nothing, and a running app cannot.
If the design is updated upstream to match, this note can go.
