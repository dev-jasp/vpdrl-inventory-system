import { StaffFormDialog } from "@/components/staff/StaffFormDialog";
import type { RawSearchParams } from "@/lib/shared/params";
import { parseStaffQuery, staffPath } from "@/lib/staff/filters";

// `/staff/new` reached from inside the app: the design's form as a modal over
// the list. A direct visit or a refresh falls through to the full page at
// `app/(dashboard)/staff/new`.

export default async function NewStaffModal({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const query = parseStaffQuery(await searchParams);

  return (
    <StaffFormDialog
      back={staffPath("/staff", query)}
      // A new starter joins the team the list is filtered to, as in the
      // design; "All staff" leaves the form on its own default.
      group={query.group === "all" ? undefined : query.group}
    />
  );
}
