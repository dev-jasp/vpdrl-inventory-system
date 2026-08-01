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
| `app/(dashboard)/suppliers/page.tsx`               | `/suppliers`                 |
| `app/(dashboard)/reports/page.tsx`                 | `/reports`                   |
| `app/(dashboard)/support/page.tsx`                 | `/support`                   |

### Modals

The design draws the item form as a dialog over the list, but a dialog with no
URL cannot be linked, refreshed or backed out of. Both are true here through a
parallel slot and intercepting routes:

```
app/(dashboard)/@modal/default.tsx                       nothing, on every other route
app/(dashboard)/@modal/(.)inventory/new/page.tsx         modal over the list
app/(dashboard)/@modal/(.)inventory/[itemId]/edit/page.tsx
app/(dashboard)/inventory/new/page.tsx                   the same form as a page
app/(dashboard)/inventory/[itemId]/edit/page.tsx
```

A navigation from inside the app is intercepted and lays the dialog over
whatever was behind it; a direct visit, a refresh or a shared link falls
through to the page. `(.)` matches the level below the group because a slot is
not a route segment. Dismissing the dialog is `router.back()`, so the URL it
masked goes away with it.

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
- **Staff profile, add/edit staff, add/edit supplier** — dialogs driven by local
  state in the design (`staffProfileOpen`, `staffFormOpen`, `supFormOpen`). If
  they should become linkable later, the item form's parallel slot above is the
  pattern to copy.
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
├── staff/       staff table, tabs/filters, profile dialog, form dialog
├── suppliers/   supplier table, supplier form dialog
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
├── staff/      grouping by type, working-day helpers, list filtering
├── suppliers/  on-time and lead-time derivation
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
  behind `?mode=`. The design's row opens the staff profile dialog and carries a
  ⋯ menu for "View staff profile" and "Edit info"; neither dialog exists yet, so
  the rows and cards are presentational rather than controls that lead nowhere,
  and "Add staff" is inert for the same reason.
- **`/inventory/new`, `/inventory/:itemId/edit`** — the item form, as a modal
  or a page (see Modals above), with photo attach and camera capture. Saving
  goes through the `saveItem` server action in
  `app/(dashboard)/inventory/actions.ts`.

Items are read through `lib/inventory/store.ts`, not from `data/items.ts`
directly. The store is a mutable module-level copy of the seed: it gives the
form somewhere to write, survives navigations and refreshes, and resets when
the server does. It is the one seam to replace with a real API.

Because the store changes under them, the routes that read it are not served
from a build-time render. `/inventory` and the item pages are dynamic already,
having searchParams or a dynamic segment to resolve; the two `new` routes say
`force-dynamic` outright, because a zone picker built from the store would
otherwise be frozen at the seed. `/` is the exception — it takes no request
input, so it prerenders, and `saveItem` calls `revalidatePath("/")` to have it
rebuilt on the next visit rather than serving yesterday's counts.

Every other route is still a placeholder page that renders the view name.

Item photos are vendored under `public/<category-folder>/` and wired to items
by `Item.photo` in `data/items.ts`. The filenames are as downloaded — spaces,
`%`, `µ`, a U+2212 minus — so anything rendering one goes through
`photoUrl` in `lib/inventory/photos.ts`, which `ItemPhoto` already does.
