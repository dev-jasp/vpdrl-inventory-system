import Link from "next/link";
import { notFound } from "next/navigation";

import { StaffForm } from "@/components/staff/StaffForm";
import { parseStaffQuery, staffPath } from "@/lib/staff/filters";
import { findStaff } from "@/lib/staff/store";

// Edit staff, as a page — the same form as `/staff/new`, prefilled. The modal
// at `app/(dashboard)/@modal/(.)staff/[staffId]/edit` is what a navigation
// from inside the app gets; this is the direct-visit fallback.

const cancelClass =
  "flex h-10 items-center rounded-[10px] border border-border-strong bg-surface px-4 text-[13px] font-semibold text-text hover:bg-muted";

export default async function EditStaffPage({
  params,
  searchParams,
}: PageProps<"/staff/[staffId]/edit">) {
  const { staffId } = await params;
  const person = findStaff(staffId);
  if (!person) notFound();

  const query = parseStaffQuery(await searchParams);
  const back = staffPath("/staff", query);

  return (
    <div className="mx-auto w-full max-w-[760px] overflow-hidden rounded-[18px] border border-border bg-surface shadow-[var(--shadow-1)]">
      <div className="border-b border-border-soft px-[26px] pt-[22px] pb-[18px]">
        <h2 className="text-xl font-semibold tracking-[-0.025em]">
          {person.name}
        </h2>
        <p className="mt-1 text-[10px] font-semibold tracking-[0.12em] text-text-4">
          EDIT STAFF · {person.id}
        </p>
      </div>
      <StaffForm
        person={person}
        back={back}
        cancel={
          <Link href={back} className={cancelClass}>
            Cancel
          </Link>
        }
      />
    </div>
  );
}
