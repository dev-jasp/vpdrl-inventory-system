import { CONSUMPTION_MONTHS, CONSUMPTION_SERIES } from "@/data/consumption";
import { activityOf } from "@/lib/inventory/activity";
import { allItems } from "@/lib/inventory/store";
import { track } from "@/lib/inventory/summary";
import { supplierRows } from "@/lib/suppliers/performance";
import { onTimeBand } from "@/lib/suppliers/performance";
import { allSuppliers } from "@/lib/suppliers/store";
import { TODAY } from "@/lib/shared/dates";

/**
 * Every report is built here, from the same stores the screens read. Nothing
 * is precomputed: a report downloaded after an item is saved contains that
 * item, which is the whole reason the "Download" button generates rather than
 * serving a file from disk.
 *
 * A row is `string[]`; the first is the header. `csv` turns that into bytes,
 * and the page measures those bytes for the size on the card — see
 * `docs/adr/0003-reports-analytics.md`.
 */
type Rows = string[][];

/**
 * RFC 4180 quoting: double the quotes, then wrap any field holding a comma, a
 * quote or a newline. Item names carry commas ("Tris base, 1 kg") and notes
 * carry both, so this is load-bearing rather than defensive.
 */
function field(value: string) {
  return /[",\n\r]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

export function csv(rows: Rows) {
  // CRLF, which is what RFC 4180 specifies and what Excel expects.
  return rows.map((row) => row.map(field).join(",")).join("\r\n");
}

/** The date an item's expiry column means, given what kind of date it is. */
function dateKind(kind: "EXP" | "CAL") {
  return kind === "CAL" ? "Calibration due" : "Expiry";
}

const BUILDERS: Record<string, () => Rows> = {
  "monthly-stock-summary": () => {
    const items = track(allItems(), TODAY);
    return [
      [
        "Item ID",
        "Name",
        "Category",
        "Zone",
        "Location",
        "On hand",
        "Unit",
        "Reorder at",
        "Status",
        "Supplier",
      ],
      ...items.map((item) => [
        item.id,
        item.name,
        item.category,
        item.zone,
        item.location,
        String(item.quantity),
        item.unit,
        String(item.min),
        item.status.kind,
        item.supplier,
      ]),
    ];
  },

  "expiry-compliance-audit": () => {
    // Everything the app would raise an alert about, loudest first — the same
    // ordering the dashboard's alert list uses.
    const items = track(allItems(), TODAY)
      .filter((item) => item.status.priority > 0)
      .sort(
        (a, b) =>
          b.status.priority - a.status.priority || a.name.localeCompare(b.name),
      );

    return [
      [
        "Item ID",
        "Name",
        "Category",
        "Status",
        "Date type",
        "Date",
        "Days remaining",
        "On hand",
        "Unit",
        "Location",
      ],
      ...items.map((item) => [
        item.id,
        item.name,
        item.category,
        item.status.kind,
        dateKind(item.expiryKind),
        item.expiry ?? "—",
        item.days === null ? "—" : String(item.days),
        String(item.quantity),
        item.unit,
        item.location,
      ]),
    ];
  },

  "supplier-performance-review": () => {
    const rows = supplierRows(allSuppliers(), allItems());
    return [
      [
        "Supplier",
        "Contact",
        "Email",
        "Phone",
        "Items supplied",
        "Categories",
        "On-time %",
        "Delivery band",
        "Lead time (days)",
      ],
      ...rows.map((supplier) => [
        supplier.name,
        supplier.contact,
        supplier.email,
        supplier.phone,
        String(supplier.itemCount),
        supplier.categories.join(", "),
        String(supplier.onTime),
        onTimeBand(supplier.onTime).kind,
        String(supplier.leadDays),
      ]),
    ];
  },

  "consumption-by-category": () => [
    ["Month", ...CONSUMPTION_SERIES.map((series) => series.label)],
    ...CONSUMPTION_MONTHS.map((month, index) => [
      month,
      ...CONSUMPTION_SERIES.map((series) => String(series.values[index] ?? 0)),
    ]),
  ],

  "purchase-order-log": () => {
    // Purchase orders are not a record type yet. The one place the app knows
    // about them is each item's synthetic "Received … · PO ####" activity
    // entry, so the log is assembled from those rather than invented here — it
    // reports exactly what the item detail already shows.
    const received = allItems()
      .flatMap((item) =>
        activityOf(item)
          .filter((entry) => entry.text.startsWith("Received"))
          .map((entry) => {
            const [quantity, order] = entry.text
              .replace("Received ", "")
              .split(" · ");
            return {
              order: order ?? "—",
              date: entry.date,
              item,
              quantity: quantity ?? "—",
              who: entry.who,
            };
          }),
      )
      .sort(
        (a, b) =>
          a.order.localeCompare(b.order) || a.item.id.localeCompare(b.item.id),
      );

    return [
      [
        "Purchase order",
        "Date received",
        "Item ID",
        "Item",
        "Quantity",
        "Supplier",
        "Received by",
      ],
      ...received.map((entry) => [
        entry.order,
        entry.date,
        entry.item.id,
        entry.item.name,
        entry.quantity,
        entry.item.supplier,
        entry.who,
      ]),
    ];
  },

  "calibration-schedule": () => {
    // Only dated equipment: an item with no calibration date has no place on a
    // schedule. Soonest first, so what is overdue leads.
    const items = track(allItems(), TODAY)
      .filter((item) => item.expiryKind === "CAL" && item.expiry !== null)
      .sort((a, b) => (a.days ?? 0) - (b.days ?? 0));

    return [
      [
        "Item ID",
        "Instrument",
        "Zone",
        "Location",
        "Calibration due",
        "Days remaining",
        "State",
        "Status",
      ],
      ...items.map((item) => [
        item.id,
        item.name,
        item.zone,
        item.location,
        item.expiry ?? "—",
        item.days === null ? "—" : String(item.days),
        (item.days ?? 0) < 0 ? "Overdue" : "Upcoming",
        item.status.kind,
      ]),
    ];
  },
};

/** The report's contents as text, or null when the id is not one we build. */
export function buildReport(id: string) {
  const builder = BUILDERS[id];
  return builder ? csv(builder()) : null;
}

/** Bytes the download will weigh, for the size on the card. */
export function reportSize(id: string) {
  const content = buildReport(id);
  return content === null ? 0 : Buffer.byteLength(content, "utf8");
}
