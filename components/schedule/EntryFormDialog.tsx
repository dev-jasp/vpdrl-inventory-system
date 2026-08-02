"use client";

import { useRouter } from "next/navigation";

import { Dialog } from "@/components/ui/Dialog";
import { secondaryButton } from "@/components/ui/buttons";

/**
 * The entry form as a modal over the calendar you opened it from. Reached
 * through the intercepted routes in `app/(dashboard)/@modal`, so dismissing it
 * is a back navigation and the URL it masked goes away with it.
 *
 * The form itself is rendered on the server and passed in as `children`; only
 * the dialog chrome and the two dismiss controls need to be here.
 */
export function EntryFormDialog({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <Dialog
      title={title}
      subtitle={subtitle}
      onClose={() => router.back()}
      className="w-[min(720px,calc(100vw-56px))]"
    >
      {children}
    </Dialog>
  );
}

/** Cancel, inside a dialog: the same dismissal as Escape and the ×. */
export function DialogCancel() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={secondaryButton}
    >
      Cancel
    </button>
  );
}
