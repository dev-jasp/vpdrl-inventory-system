"use client";

import { useRouter } from "next/navigation";

import { StaffProfile } from "@/components/staff/StaffProfile";
import { Dialog } from "@/components/ui/Dialog";
import type { Staff } from "@/types/staff";

/**
 * The profile as the design draws it — a modal over the list you opened it
 * from. Reached through the intercepted route in `app/(dashboard)/@modal`, so
 * dismissing it is a back navigation: the URL it masked goes away with it.
 */
export function StaffProfileDialog({
  person,
  editHref,
}: {
  person: Staff;
  editHref: string;
}) {
  const router = useRouter();
  const close = () => router.back();

  return (
    <Dialog
      title={person.name}
      titleHidden
      onClose={close}
      className="w-[min(480px,calc(100vw-56px))]"
    >
      <StaffProfile
        person={person}
        editHref={editHref}
        close={
          <button
            type="button"
            onClick={close}
            className="flex h-10 flex-1 items-center justify-center rounded-[10px] border border-border-strong bg-surface text-[13px] font-semibold text-text hover:bg-muted"
          >
            Close
          </button>
        }
      />
    </Dialog>
  );
}
