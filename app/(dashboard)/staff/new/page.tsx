import Link from "next/link";

import { StaffForm } from "@/components/staff/StaffForm";
import { parseStaffQuery, staffPath } from "@/lib/staff/filters";

// Add staff, as a page. The design only ever draws this as a modal, which is
// what `app/(dashboard)/@modal/(.)staff/new` renders for navigations from
// inside the app; this is what a direct visit, a refresh or a shared link
// gets, where there is no list behind it to lay a modal over.

const cancelClass =
  "flex h-10 items-center rounded-[10px] border border-border-strong bg-surface px-4 text-[13px] font-semibold text-text hover:bg-muted";

export default async function NewStaffPage({
  searchParams,
}: PageProps<"/staff/new">) {
  // The list the form was opened from, so Cancel and a finished save both go
  // back to it rather than to an unfiltered page 1.
  const query = parseStaffQuery(await searchParams);
  const back = staffPath("/staff", query);

  return (
    <div className="mx-auto w-full max-w-[760px] overflow-hidden rounded-[18px] border border-border bg-surface shadow-[var(--shadow-1)]">
      <div className="border-b border-border-soft px-[26px] pt-[22px] pb-[18px]">
        <h2 className="text-xl font-semibold tracking-[-0.025em]">
          Add new staff
        </h2>
        <p className="mt-1 text-[10px] font-semibold tracking-[0.12em] text-text-4">
          NEW TEAM MEMBER
        </p>
      </div>
      <StaffForm
        back={back}
        // A new starter joins the team the list is filtered to, as in the
        // design; "All staff" leaves the form on its own default.
        group={query.group === "all" ? undefined : query.group}
        cancel={
          <Link href={back} className={cancelClass}>
            Cancel
          </Link>
        }
      />
    </div>
  );
}
