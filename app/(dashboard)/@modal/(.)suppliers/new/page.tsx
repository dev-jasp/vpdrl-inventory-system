import { SupplierFormDialog } from "@/components/suppliers/SupplierFormDialog";

// `/suppliers/new` reached from inside the app: the design's form as a modal
// over the table. A direct visit or a refresh falls through to the full page at
// `app/(dashboard)/suppliers/new`.

export default function NewSupplierModal() {
  return <SupplierFormDialog />;
}
