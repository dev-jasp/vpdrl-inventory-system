# Folder structure

Derived from `design/LabTrack Dashboard.dc.html`, a vendored snapshot of the
Claude Design project `9ee7c3ab-1c78-4af2-9af1-8b47dbe27429` — see
`docs/agents/design.md` for how to read and refresh it. App Router, no `src/`
folder, `@/*` resolves to the repo root.

## Routes

Every view shares one shell (sidebar + topbar), so all pages live in a
`(dashboard)` route group. The group name is omitted from the URL.

| Path                                               | URL                          |
| -------------------------------------------------- | ---------------------------- |
| `app/layout.tsx`                                   | root layout, fonts, metadata |
| `app/(dashboard)/layout.tsx`                       | app shell                    |
| `app/(dashboard)/page.tsx`                         | `/`                          |
| `app/(dashboard)/inventory/page.tsx`               | `/inventory`                 |
| `app/(dashboard)/inventory/new/page.tsx`           | `/inventory/new`             |
| `app/(dashboard)/inventory/[itemId]/page.tsx`      | `/inventory/:itemId`         |
| `app/(dashboard)/inventory/[itemId]/edit/page.tsx` | `/inventory/:itemId/edit`    |
| `app/(dashboard)/purchase-orders/page.tsx`         | `/purchase-orders`           |
| `app/(dashboard)/staff/page.tsx`                   | `/staff`                     |
| `app/(dashboard)/staff/new/page.tsx`               | `/staff/new`                 |
| `app/(dashboard)/staff/[staffId]/page.tsx`         | `/staff/:staffId`            |
| `app/(dashboard)/staff/[staffId]/edit/page.tsx`    | `/staff/:staffId/edit`       |
| `app/(dashboard)/suppliers/page.tsx`               | `/suppliers`                 |
| `app/(dashboard)/reports/page.tsx`                 | `/reports`                   |
| `app/(dashboard)/support/page.tsx`                 | `/support`                   |

### Modals

The design draws the item form, the staff profile, the staff form and the
supplier form as dialogs over the list, but a dialog with no URL cannot be
linked, refreshed or backed out of. Both are true here through a parallel slot
and intercepting routes:

```
app/(dashboard)/@modal/default.tsx                       nothing, on a full page load
app/(dashboard)/@modal/page.tsx                          nothing, on `/`
app/(dashboard)/@modal/[...catchAll]/page.tsx            nothing, on every other route
app/(dashboard)/@modal/(.)inventory/new/page.tsx         modal over the list
app/(dashboard)/@modal/(.)inventory/[itemId]/edit/page.tsx
app/(dashboard)/inventory/new/page.tsx                   the same form as a page
app/(dashboard)/inventory/[itemId]/edit/page.tsx

app/(dashboard)/@modal/(.)staff/new/page.tsx             modal over the list
app/(dashboard)/@modal/(.)staff/[staffId]/page.tsx
app/(dashboard)/@modal/(.)staff/[staffId]/edit/page.tsx
app/(dashboard)/staff/new/page.tsx                       the same views as pages
app/(dashboard)/staff/[staffId]/page.tsx
app/(dashboard)/staff/[staffId]/edit/page.tsx

app/(dashboard)/@modal/(.)suppliers/new/page.tsx         modal over the table
app/(dashboard)/@modal/(.)suppliers/[supplier]/edit/page.tsx
app/(dashboard)/suppliers/new/page.tsx                   the same form as a page
app/(dashboard)/suppliers/[supplier]/edit/page.tsx
```

A navigation from inside the app is intercepted and lays the dialog over
whatever was behind it; a direct visit, a refresh or a shared link falls
through to the page. `(.)` matches the level below the group because a slot is
not a route segment. Dismissing the dialog is `router.back()`, so the URL it
masked goes away with it.

The two pages that render nothing are what _close_ a dialog. A slot keeps
showing whatever it last matched across a client-side navigation — `default.tsx`
only gets a say on a full page load — so without them a dialog stayed on screen
after the redirect at the end of a save, and after any sidebar link. Matching
every other route to a page that renders nothing is the fix the parallel-routes
docs prescribe; the intercepting routes are more specific, so they still win
where they apply. The catch-all cannot match `/`, which has no segment for it to
bind, hence the `page.tsx` beside it.

The three staff routes carry the list's searchParams the way `/inventory/:itemId`
carries the inventory list's, and for the same reason: it is the only way Close,
Cancel and a finished save can return to the filtered page somebody opened them
from rather than to an unfiltered page 1. `staffPath` in `lib/staff/filters.ts`
builds them.

The two supplier routes carry nothing, because `/suppliers` has no filters,
search or paging to come back to. Their segment is the supplier's **name** — the
identity, since a supplier has no id (`types/supplier.ts`) — URL-encoded by the
row menu and decoded back by the route.

### What is deliberately _not_ a route

- **Chemicals, Equipment, Low stock, Expiring / due** — sidebar entries that in
  the design call `goList(...)` with a filter. They are `/inventory` with
  searchParams (`cat`, `flag`, `zone`, `q`, `sort`, `dir`, `page`, `per`), so
  filters stay shareable and bookmarkable without duplicating the list page.
  `lib/inventory/filters.ts` is the one place that reads and writes them; the
  param names and sort keys are the design's own.
- **All staff / Lab technicians / Support staff** — tabs in the design, and
  `/staff` with searchParams (`group`, `q`, `full`, `mode`, `page`, `per`) here,
  for the same reason the inventory filters are. `lib/staff/filters.ts` owns
  them. The design holds this in component state and so has no param names to
  inherit; unlike the inventory list's, these are ours.
- **Add/edit supplier** — a dialog driven by local state in the design
  (`supFormOpen`). If it should become linkable later, the parallel slot above is
  the pattern to copy, as the staff profile and form already do.
- **Photo capture** — the camera lives inside the item form (`camOn` in the
  design), not at a URL of its own.

## Components

Grouped by feature, not by type. `components/charts/` already existed.

```
components/
├── ui/          buttons, badges, cards, dialogs, inputs, selects, tables, avatars,
│                tooltips, pagination — no domain knowledge
├── layout/      sidebar, nav groups, topbar, page title, search, user menu, theme toggle
├── charts/      AreaChart, BarChart, DonutChart, LineChart (pre-existing)
├── dashboard/   consumption trend, stock distribution, spend vs. budget, alerts,
│                top consumed, stock status tracker, recent activity, upcoming
│                calibrations, on-duty today, handover note, to-do list
├── inventory/   item table + grid, filters, detail panels (stock position, lots,
│                withdrawals, activity, specification), item form, photo capture
├── staff/       staff table + cards, tabs/filters, row menu, profile, staff form
│                and its photo field, each wrapped in a dialog for the modal route
├── suppliers/   supplier table (contact, catalogue, delivery performance),
│                row menu, and the supplier form wrapped in a dialog for the
│                modal route
├── reports/     report list rows, download actions
└── support/     FAQ accordion, contact channels, status card
```

## Domain and data

```
types/    domain types — Item, Lot, Staff, Supplier, Report, Alert, Activity,
          Todo, StockStatus, Category
lib/
├── inventory/  status derivation (Available / Low Stock / Out of Stock /
│               Expiring Soon / Expired / Cal. Due / Cal. Overdue), filtering,
│               sorting, chart aggregation, and the synthetic stand-ins the
│               design derives from an item id — lots, weekly usage, activity —
│               which stay put until those become real records
├── staff/      grouping by type, working-day helpers, list filtering, the
│               searchParams the list travels on, and reading the form back
├── suppliers/  on-time banding, joining a supplier to what it supplies, the
│               store, and reading the form back
└── shared/     currency (₱), dates, units, and the pieces both lists share —
                paginating a list, and reading typed values off searchParams
data/     seed datasets standing in for the API
```

`utils/` (pre-existing) holds UI-level helpers shipped with the chart kit —
`cx`, focus rings, axis domains. Keep domain logic out of it; that belongs in
`lib/`.

## Status

The app shell is built — `app/(dashboard)/layout.tsx` with `components/layout/`
(sidebar, nav, topbar, search, theme toggle, user menu) and the design tokens in
`app/globals.css`.

Built on top of it:

- **`/`** — on duty, consumption trend, stock distribution, spend vs. budget,
  alerts, top consumed, stock status tracker. Still to come: handover note,
  to-do list, recent activity, upcoming calibrations.
- **`/inventory`** — the list: category / flag / zone filters, sortable
  columns, paging, and the photo tile. The row's tile is a file input in the
  design; that lands with the item form and photo capture.
- **`/inventory/:itemId`** — stock position, lots, withdrawals, activity,
  specification and the dated control. Unknown ids `notFound()`. Rows link to
  it carrying the list's searchParams, which is the only way "← Back to
  inventory" can return to the filtered list the design never left.
- **`/staff`** — the list: group filter, search over name / role / email /
  phone, the full-time chip, and the design's two view modes (table and cards)
  behind `?mode=`. Rows and cards open the profile — one link on the name
  stretched across the row, so it stays a real link — and the row's ⋯ menu holds
  the design's "View staff profile" and "Edit info".
- **`/staff/:staffId`** — the profile: the face, contact, rota and zones, as a
  modal or a page (see Modals above). Unknown ids `notFound()`. The dashboard's
  on-duty avatars link here too, without filters.
- **`/staff/new`, `/staff/:staffId/edit`** — the staff form, as a modal or a
  page, with the photo tile, the team and contract chips and the seven day
  toggles. A new starter opens on the team the list is filtered to. Saving goes
  through the `saveStaff` server action in `app/(dashboard)/staff/actions.ts`,
  which lands back on the list the form was opened from.
- **`/inventory/new`, `/inventory/:itemId/edit`** — the item form, as a modal
  or a page (see Modals above), with photo attach and camera capture. Saving
  goes through the `saveItem` server action in
  `app/(dashboard)/inventory/actions.ts`.
- **`/suppliers`** — the supplier table: contact details, what each one
  supplies, and how well they deliver. Rows open `/inventory` filtered to that
  supplier, which is what the design's row click does. The two performance
  columns are ours in the sense that the design draws neither — it carries
  `onTime` and `lead` on every supplier, edits both in its form, computes a
  colour band for the percentage, and then stops the table at ITEMS. No
  filters, search or paging: the design gives this list none. "+ Add supplier"
  opens the form, and the row's ⋯ menu holds the design's single "Edit
  supplier".
- **`/suppliers/new`, `/suppliers/:supplier/edit`** — the supplier form, as a
  modal or a page (see Modals above). Saving goes through the `saveSupplier`
  server action in `app/(dashboard)/suppliers/actions.ts`. Because the name is
  the identity and `Item.supplier` joins on it, that action does two writes: the
  record, and `renameItemSupplier` for the catalogue when the name changed. The
  name is required and has to be unique, where the design allows a blank one and
  falls back to "Untitled supplier".

Items are read through `lib/inventory/store.ts`, people through
`lib/staff/store.ts` and suppliers through `lib/suppliers/store.ts`, not from
`data/items.ts`, `data/staff.ts` or `data/suppliers.ts` directly. A store is a
mutable module-level copy of the seed: it gives the form somewhere to write,
survives navigations and refreshes, and resets when the server does. The three
are the seams to replace with a real API.

Because the stores change under them, the routes that read them are not served
from a build-time render. `/inventory`, `/staff` and everything under them are
dynamic already, having searchParams or a dynamic segment to resolve; the two
inventory `new` routes say `force-dynamic` outright, because a zone picker built
from the store would otherwise be frozen at the seed.

`/`, `/suppliers` and `/suppliers/new` are the exceptions — none takes request
input, so all three prerender, and the actions revalidate them: `saveItem` and
`saveStaff` call `revalidatePath("/")` for the dashboard's counts and on-duty
row, both call `revalidatePath("/suppliers")` for the ITEMS column, and
`saveSupplier` calls it for the supplier's own row. A rename also revalidates
`/inventory` and the item pages, because the items carry the name it changed.

Every other route is still a placeholder page that renders the view name.

Item photos are vendored under `public/<category-folder>/` and wired to items
by `Item.photo` in `data/items.ts`. The filenames are as downloaded — spaces,
`%`, `µ`, a U+2212 minus — so anything rendering one goes through
`photoUrl` in `lib/inventory/photos.ts`, which `ItemPhoto` already does.
