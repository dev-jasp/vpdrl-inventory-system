# Folder structure

Derived from the `LabTrack Dashboard.dc.html` design (Claude Design project
`9ee7c3ab-1c78-4af2-9af1-8b47dbe27429`). App Router, no `src/` folder, `@/*`
resolves to the repo root.

## Routes

Every view shares one shell (sidebar + topbar), so all pages live in a
`(dashboard)` route group. The group name is omitted from the URL.

| Path                                             | URL                     |
| ------------------------------------------------ | ----------------------- |
| `app/layout.tsx`                                 | root layout, fonts, metadata |
| `app/(dashboard)/layout.tsx`                     | app shell               |
| `app/(dashboard)/page.tsx`                       | `/`                     |
| `app/(dashboard)/inventory/page.tsx`             | `/inventory`            |
| `app/(dashboard)/inventory/new/page.tsx`         | `/inventory/new`        |
| `app/(dashboard)/inventory/[itemId]/page.tsx`    | `/inventory/:itemId`    |
| `app/(dashboard)/inventory/[itemId]/edit/page.tsx` | `/inventory/:itemId/edit` |
| `app/(dashboard)/purchase-orders/page.tsx`       | `/purchase-orders`      |
| `app/(dashboard)/staff/page.tsx`                 | `/staff`                |
| `app/(dashboard)/suppliers/page.tsx`             | `/suppliers`            |
| `app/(dashboard)/reports/page.tsx`               | `/reports`              |
| `app/(dashboard)/support/page.tsx`               | `/support`              |

### What is deliberately *not* a route

- **Chemicals, Equipment, Low stock, Expiring / due** — sidebar entries that in
  the design call `goList(...)` with a filter. They are `/inventory` with
  searchParams (`cat`, `flag`, `zone`, `q`, `sort`), so filters stay
  shareable and bookmarkable without duplicating the list page.
- **Staff profile, add/edit staff, add/edit supplier, photo capture** — dialogs
  driven by local state in the design (`staffProfileOpen`, `staffFormOpen`,
  `supFormOpen`, `camOn`). If they should become linkable later, intercepting
  routes are the upgrade path.

## Components

Grouped by feature, not by type. `components/charts/` already existed.

```
components/
├── ui/          buttons, badges, cards, dialogs, inputs, selects, tables, avatars,
│                tooltips, pagination — no domain knowledge
├── layout/      sidebar, nav groups, topbar, search, breadcrumb, user menu, theme toggle
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
│               sorting, chart aggregation
├── staff/      grouping by type, working-day helpers
├── suppliers/  on-time and lead-time derivation
└── shared/     currency (₱), dates, units
data/     seed datasets standing in for the API
```

`utils/` (pre-existing) holds UI-level helpers shipped with the chart kit —
`cx`, focus rings, axis domains. Keep domain logic out of it; that belongs in
`lib/`.

## Status

Routes are placeholder pages that render the view name. No design
implementation yet.
