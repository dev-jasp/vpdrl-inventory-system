import { notFound } from "next/navigation";

import { StaffFormDialog } from "@/components/staff/StaffFormDialog";
import type { RawSearchParams } from "@/lib/shared/params";
import { parseStaffQuery, staffPath } from "@/lib/staff/filters";
import { findStaff } from "@/lib/staff/store";

// `/staff/:staffId/edit` reached from inside the app — the same form as
// `/staff/new`, prefilled, as a modal over the page behind it.

export default async function EditStaffModal({
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

  return <StaffFormDialog person={person} back={staffPath("/staff", query)} />;
}
