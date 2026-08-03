import { notFound } from "next/navigation";

import { StaffProfileDialog } from "@/components/staff/StaffProfileDialog";
import { findStaff } from "@/lib/staff/store";

// `/staff/:staffId` reached from inside the app — the design's profile dialog,
// laid over the list the row was clicked in.
//
// It reads no search params. The list's filters were only ever needed to build
// an edit link back through them, and the profile no longer offers one; the
// dialog dismisses with a back navigation, which restores the filtered URL it
// masked without this route having to know what was in it.

export default async function StaffProfileModal({
  params,
}: {
  params: Promise<{ staffId: string }>;
}) {
  const { staffId } = await params;
  const person = findStaff(staffId);
  if (!person) notFound();

  return <StaffProfileDialog person={person} />;
}
