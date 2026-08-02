# 4. Schedule: a projected calendar, and bookings as their own records

Date: 2026-08-02

## Status

Accepted.

## Context

The lab tracks three kinds of dated work, and the app could hold none of it.

- **Calibrations coming due.** Modelled already, but only as a deadline:
  `Item.expiry` with `expiryKind: "CAL"`, surfacing as the `Cal. Due` and
  `Cal. Overdue` statuses on `/inventory`. Nothing records who is doing it or
  when.
- **Consignments arriving.** A property of a purchase order, and
  `/purchase-orders` is still a page that renders its own name — no type, no
  seed, no store.
- **Supplier meetings and paper follow-ups.** Quotation walkthroughs, RFQ
  chases, delivery-receipt reconciliations. Nothing in `types/` comes close.

`design/LabTrack Dashboard.dc.html` is no help here. Its `navDef` has four
groups and eight rows, none of them a schedule, and it draws no calendar
anywhere. So unlike every other view in this repo, there is no drawing to port
and no `setState` call to translate. The layout is taken instead from a
resource-calendar reference — a dental clinic's day view, columns per
practitioner and rows per clock hour — and rebuilt on this app's primitives and
tokens.

That reference brings an assumption the data does not meet. Its skeleton works
because an appointment has a time of day and a duration. `Item.expiry` is a
date: "2026-08-19", no hour. A calibration due that day cannot honestly be
drawn as a 09:00–10:00 block.

## Decision

### Calibration due dates are projected, never stored

`lib/schedule/events.ts` derives a `ScheduleEvent` for every item with a
calibration date. The schedule store holds no copy.

The alternative — seeding calibration events into `data/schedule.ts` alongside
the meetings — was rejected because it puts one fact in two places. Move an
instrument's date on the item form and the calendar would go on showing the old
one, while `Cal. Overdue` on the inventory list showed the new one, with nothing
in the app to say which was right.

### A booking is a separate record, not an edit to the due date

Performing a calibration is not the same fact as its being due. So a booking is
an authored `ScheduleEntry` with `kind: "CAL"` carrying `itemId`, and the due
date stays exactly where it was. Two facts about one instrument, each owned
once: the deadline by the catalogue, the appointment by the schedule.

The projected due date reads the booking back — its pill becomes `Booked` and
its subtitle names the day the work is happening — but it is still the item's
date that says when it is due.

This is why `parseScheduleForm` insists a `CAL` entry name an item that
actually exists. A booking pointing at nothing can never be matched to the due
date it was made to satisfy, so the due date would go on reading as unbooked
while an appointment sat in somebody's column: the two facts silently
disagreeing, which is the failure this whole split exists to prevent.

### Date-only by default; a window promotes an entry into the grid

`start` and `minutes` are nullable together. An entry without them is
**unscheduled**: known to be happening on a date, not yet at an hour. That is
the honest state of a delivery a supplier has promised for "sometime Tuesday",
and it is a state the form offers rather than treats as a field somebody forgot.

Unscheduled entries and projected due dates are drawn in an **all-day band**
across the top, full width rather than divided into the grid's columns — a
date-only event is not booked against anybody's clock. Pinning a window is what
moves a card down into a column.

`?when=unscheduled` asks the same question globally: everything still waiting
for an hour, across every date, oldest first.

### Two views, one axis

**Day** is people across and hours down, each window sized by its duration.
**Week** is people down and days across, with no hour rows.

The conventional week calendar swaps the axis to seven day columns. Keeping
people on both means the two views answer the same question — and it buys the
rota for nothing: `Staff.days` is seven characters Monday-first, exactly the
week grid's shape, so a person's off-days hatch straight across their row. The
week view is the schedule and the rota at once, and an entry drawn on a hatched
cell is somebody booked on their day off, visible across a whole week.

### Columns are the people with work, not the whole rota

The reference draws a column per practitioner and marks the idle ones `NOT
AVAILABLE`. With fourteen staff, thirteen of them on duty on a Wednesday and
two with anything dated, that is eleven columns of air and the horizontal
scroll they cost is paid by the two that matter.

So `lanesFor` gives a column to whoever has work in view, plus an
**Unassigned** lane for events nobody owns. Off duty still renders — a lane
whose owner is not rostered says so and tints — because booking somebody onto
their day off is a thing the app should let you *see*.

### An overdue calibration is drawn on today

An unbooked date that has lapsed surfaces on the current day rather than on the
day it lapsed. A deadline three weeks gone is still outstanding work, and
leaving it in place means the only way to find it is to page backwards to a
week nobody has a reason to open. Booked ones stay put: the booking is where
the work now lives.

### The sub-nav's first entry is "Calendar", not "Today"

`SCHEDULE_CHILD_GROUPS` follows `INVENTORY_CHILD_GROUPS` — an unheaded default,
then **When** and **Kind** runs of searchParam presets, split so that the two
axes read as combinable.

The unheaded entry is "Calendar" rather than "Today" because `activeChild`
resolves presets by their pinned params and does not look at `date`. A "Today"
entry would go on reading as active after paging to next Thursday. Today is a
control in the page header instead, where the reference puts it and where it
can be honest about what it means.

## Consequences

- Deleting an item deletes its calibration events, because they were never
  records. Deleting a *booking* leaves the due date standing, which is right.
- Delivery entries carry `supplier` and a free-text `reference` rather than a
  purchase order id. When `/purchase-orders` becomes real, that arm of the
  union is what a PO store replaces; `ScheduleEvent.source` already marks
  which events are projections.
- The all-day band scrolls at four rows. The day a quarter's calibrations come
  due together it must not push the grid off screen.
- `calendar` moved into `HEROICONS` in `components/ui/Icon.tsx`. Every other
  nav icon is already a Heroicon at 1.5, and the design's own calendar glyph at
  1.7 sat visibly heavier than the rows either side of it — see
  `docs/adr/0002-icons.md`.
- **Log History is deferred.** The reference pairs its calendar with a second
  tab, and the header leaves room for one, but an audit trail means a record
  written on every mutation and every mutation path reaching it. Not in this
  change.
