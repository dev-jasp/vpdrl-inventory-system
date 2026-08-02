import Link from "next/link";
import { notFound } from "next/navigation";

import { SupplierForm } from "@/components/suppliers/SupplierForm";
import { secondaryButton } from "@/components/ui/buttons";
import { findSupplier } from "@/lib/suppliers/store";

// Edit supplier, as a page — the fallback behind the intercepted modal at
// `app/(dashboard)/@modal/(.)suppliers/[supplier]/edit`, for a direct visit,
// a refresh or a shared link.
//
// The segment is the supplier's name, because that is the identity: there is
// no id to route on (see `types/supplier.ts`). Next decodes it for us, so a
// name with a space arrives whole.

export default async function EditSupplierPage({
  params,
}: PageProps<"/suppliers/[supplier]/edit">) {
  const { supplier: name } = await params;
  const supplier = findSupplier(name);
  if (!supplier) notFound();

  return (
    <div className="mx-auto w-full max-w-[680px] overflow-hidden rounded-sm border border-border bg-surface shadow-[var(--shadow-1)]">
      <div className="border-b border-border-soft px-[26px] pt-[22px] pb-[18px]">
        <h2 className="text-xl font-normal tracking-[-0.025em]">
          {supplier.name}
        </h2>
      </div>
      <SupplierForm
        supplier={supplier}
        cancel={
          <Link href="/suppliers" className={secondaryButton}>
            Cancel
          </Link>
        }
      />
    </div>
  );
}
