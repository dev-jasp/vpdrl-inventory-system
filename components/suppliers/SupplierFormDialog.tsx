"use client";

import { useRouter } from "next/navigation";

import { SupplierForm } from "@/components/suppliers/SupplierForm";
import { Dialog } from "@/components/ui/Dialog";
import { secondaryButton } from "@/components/ui/buttons";
import type { Supplier } from "@/types/supplier";

/**
 * The supplier form as the design draws it — a modal over the table you opened
 * it from. Reached through the intercepted routes in `app/(dashboard)/@modal`,
 * so dismissing it is a back navigation: the URL it masked goes away with it.
 *
 * No subtitle, unlike the staff dialog: the design gives its supplier form a
 * bare title (`supFormTitle`) where it gives the staff form a kicker as well
 * (`staffFormSub`).
 */
export function SupplierFormDialog({ supplier }: { supplier?: Supplier }) {
  const router = useRouter();
  const close = () => router.back();

  return (
    <Dialog
      title={supplier ? supplier.name : "Add supplier"}
      onClose={close}
      className="w-[min(680px,calc(100vw-56px))]"
    >
      <SupplierForm
        supplier={supplier}
        cancel={
          <button type="button" onClick={close} className={secondaryButton}>
            Cancel
          </button>
        }
      />
    </Dialog>
  );
}
