import Link from "next/link";
import { notFound } from "next/navigation";

import { StaffProfile } from "@/components/staff/StaffProfile";
import { parseStaffQuery, staffEditHref, staffPath } from "@/lib/staff/filters";
import { findStaff } from "@/lib/staff/store";

// A staff profile, as a page. The design draws it only as a dialog over the
// list, which is what `app/(dashboard)/@modal/(.)staff/[staffId]` renders for
// navigations from inside the app; this is the direct-visit fallback.

export default async function StaffProfilePage({
  params,
  searchParams,
}: PageProps<"/staff/[staffId]">) {
  const { staffId } = await params;
  const person = findStaff(staffId);
  if (!person) notFound();

  const query = parseStaffQuery(await searchParams);

  return (
    <div className="mx-auto w-full max-w-[480px] rounded-[18px] border border-border bg-surface pt-[22px] shadow-[var(--shadow-1)]">
      <StaffProfile
        person={person}
        editHref={staffEditHref(query, person.id)}
        close={
          <Link
            href={staffPath("/staff", query)}
            className="flex h-10 flex-1 items-center justify-center rounded-[10px] border border-border-strong bg-surface text-[13px] font-semibold text-text hover:bg-muted"
          >
            Close
          </Link>
        }
      />
    </div>
  );
}
