import Link from "next/link";

import { SuppliersTable } from "@/components/suppliers/SuppliersTable";
import { primaryButton } from "@/components/ui/buttons";
import { cx } from "@/utils/cx";
import { allItems } from "@/lib/inventory/store";
import { supplierRows } from "@/lib/suppliers/performance";
import { allSuppliers } from "@/lib/suppliers/store";

// Suppliers — who the lab buys from, what they supply, and how well they
// deliver. Ported from `LabTrack Dashboard.dc.html`, plus the two performance
// columns the design carries on every supplier and never draws (see
// `lib/suppliers/performance.ts`).
//
// No filters, search or paging: the design gives this list none, and sixteen
// suppliers ordered by how much of the catalogue rides on them is a page you
// read rather than one you query. Nothing to carry back either, which is why
// the form's routes take no searchParams where the staff form's do.

export default function SuppliersPage() {
  // Both sides come from their stores rather than the seeds, so a supplier
  // added in the form and an item pointed at one both count immediately.
  const rows = supplierRows(allSuppliers(), allItems());

  return (
    // The shell's 14px lands 12px short of the design's 26px here.
    <div className="flex flex-col gap-[18px] pt-3">
      <div className="flex items-center">
        <p className="text-[13px] font-normal text-text-3">
          {rows.length} suppliers on record
        </p>

        <Link href="/suppliers/new" className={cx("ml-auto", primaryButton)}>
          + Add supplier
        </Link>
      </div>

      <div className="overflow-hidden rounded-[14px] border border-border bg-surface shadow-[var(--shadow-1)]">
        <SuppliersTable rows={rows} />
      </div>
    </div>
  );
}
