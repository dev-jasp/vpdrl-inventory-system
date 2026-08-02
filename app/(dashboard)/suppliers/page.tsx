import { SuppliersTable } from "@/components/suppliers/SuppliersTable";
import { SUPPLIERS } from "@/data/suppliers";
import { allItems } from "@/lib/inventory/store";
import { supplierRows } from "@/lib/suppliers/performance";

// Suppliers — who the lab buys from, what they supply, and how well they
// deliver. Ported from `LabTrack Dashboard.dc.html`, plus the two performance
// columns the design carries on every supplier and never draws (see
// `lib/suppliers/performance.ts`).
//
// No filters, search or paging: the design gives this list none, and sixteen
// suppliers ordered by how much of the catalogue rides on them is a page you
// read rather than one you query.
//
// TODO: the design opens the supplier form dialog from "+ Add supplier"
// (`supFormOpen`) and offers "Edit supplier" from a ⋯ menu on the row. Neither
// exists yet, so the button is inert and there is no ⋯ column — a menu whose
// only entry goes nowhere is worse than no menu.

export default function SuppliersPage() {
  // Item counts come from the store rather than the seed, so a supplier picked
  // in the item form starts counting immediately. `saveItem` revalidates this
  // path for the same reason it revalidates the dashboard.
  const rows = supplierRows(SUPPLIERS, allItems());

  return (
    // The shell's 14px lands 12px short of the design's 26px here.
    <div className="flex flex-col gap-[18px] pt-3">
      <div className="flex items-center">
        <p className="text-[13px] font-normal text-text-3">
          {rows.length} suppliers on record
        </p>

        <button
          type="button"
          disabled
          className="ml-auto flex h-[38px] items-center rounded-[10px] bg-[#3b82f6] px-[18px] text-[13px] font-semibold text-white disabled:opacity-60"
        >
          + Add supplier
        </button>
      </div>

      <div className="overflow-hidden rounded-[14px] border border-border bg-surface shadow-[var(--shadow-1)]">
        <SuppliersTable rows={rows} />
      </div>
    </div>
  );
}
