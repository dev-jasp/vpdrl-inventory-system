"use client";

import { useRouter } from "next/navigation";

import { StaffForm } from "@/components/staff/StaffForm";
import { Dialog } from "@/components/ui/Dialog";
import type { Staff, StaffGroup } from "@/types/staff";

/**
 * The staff form as the design draws it — a modal over the list you opened it
 * from. Reached through the intercepted routes in `app/(dashboard)/@modal`, so
 * dismissing it is a back navigation: the URL it masked goes away with it.
 */
export function StaffFormDialog({
  person,
  back,
  group,
}: {
  person?: Staff;
  back: string;
  group?: StaffGroup;
}) {
  const router = useRouter();
  const close = () => router.back();

  return (
    <Dialog
      title={person ? person.name : "Add new staff"}
      subtitle={person ? `EDIT STAFF · ${person.id}` : "NEW TEAM MEMBER"}
      onClose={close}
      className="w-[min(760px,calc(100vw-56px))]"
    >
      <StaffForm
        person={person}
        back={back}
        group={group}
        cancel={
          <button
            type="button"
            onClick={close}
            className="flex h-10 items-center rounded-[10px] border border-border-strong bg-surface px-4 text-[13px] font-semibold text-text hover:bg-muted"
          >
            Cancel
          </button>
        }
      />
    </Dialog>
  );
}
