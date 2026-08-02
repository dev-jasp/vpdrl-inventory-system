import { notFound } from "next/navigation";

import { StaffProfileDialog } from "@/components/staff/StaffProfileDialog";
import type { RawSearchParams } from "@/lib/shared/params";
import { parseStaffQuery, staffEditHref } from "@/lib/staff/filters";
import { findStaff } from "@/lib/staff/store";

// `/staff/:staffId` reached from inside the app — the design's profile dialog,
// laid over the list the row was clicked in.

export default async function StaffProfileModal({
  params,
  searchParams,
}: {
  params: Promise<{ staffId: string }>;
  searchParams: Promise<RawSearchParams>;
}) {
  const { staffId } = await params;
  const person = findStaff(staffId);
  if (!person) notFound();

  const query = parseStaffQuery(await searchParams);

  return (
    <StaffProfileDialog
      person={person}
      editHref={staffEditHref(query, person.id)}
    />
  );
}
