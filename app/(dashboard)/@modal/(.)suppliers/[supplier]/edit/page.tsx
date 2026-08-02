import { notFound } from "next/navigation";

import { SupplierFormDialog } from "@/components/suppliers/SupplierFormDialog";
import { findSupplier } from "@/lib/suppliers/store";

// `/suppliers/:supplier/edit` reached from inside the app — the same form as
// `/suppliers/new`, prefilled, as a modal over the table behind it.

export default async function EditSupplierModal({
  params,
}: {
  params: Promise<{ supplier: string }>;
}) {
  const { supplier: name } = await params;
  const supplier = findSupplier(name);
  if (!supplier) notFound();

  return <SupplierFormDialog supplier={supplier} />;
}
