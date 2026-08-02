import Link from "next/link";

import { SupplierForm } from "@/components/suppliers/SupplierForm";

// Add supplier, as a page. The design only ever draws this as a modal, which
// is what `app/(dashboard)/@modal/(.)suppliers/new` renders for navigations
// from inside the app; this is what a direct visit, a refresh or a shared link
// gets, where there is no table behind it to lay a modal over.

const cancelClass =
  "flex h-10 items-center rounded-[10px] border border-border-strong bg-surface px-4 text-[13px] font-semibold text-text hover:bg-muted";

export default function NewSupplierPage() {
  return (
    <div className="mx-auto w-full max-w-[680px] overflow-hidden rounded-[18px] border border-border bg-surface shadow-[var(--shadow-1)]">
      <div className="border-b border-border-soft px-[26px] pt-[22px] pb-[18px]">
        <h2 className="text-xl font-semibold tracking-[-0.025em]">
          Add supplier
        </h2>
      </div>
      <SupplierForm
        cancel={
          <Link href="/suppliers" className={cancelClass}>
            Cancel
          </Link>
        }
      />
    </div>
  );
}
