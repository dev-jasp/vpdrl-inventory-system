import { StaffGrid } from "@/components/staff/StaffGrid";
import { StaffList } from "@/components/staff/StaffList";
import { StaffToolbar } from "@/components/staff/StaffToolbar";
import { Pagination } from "@/components/ui/Pagination";
import { STAFF } from "@/data/staff";
import { paginate } from "@/lib/shared/pagination";
import {
  PER_PAGE_OPTIONS,
  filterStaff,
  parseStaffQuery,
  staffHref,
} from "@/lib/staff/filters";

// Staff list — group filter, search, and the design's two view modes, read out
// of searchParams (group, q, full, mode, page, per) so a narrowed list is a URL
// somebody can send.
//
// Still to build from `LabTrack Dashboard.dc.html`: the staff profile and the
// add/edit staff form, both dialogs in the mockup.

export default async function StaffPage({ searchParams }: PageProps<"/staff">) {
  const query = parseStaffQuery(await searchParams);

  const matched = filterStaff(STAFF, query);
  const { rows, page, pages, total } = paginate(matched, query);

  return (
    <div>
      <StaffToolbar query={query} total={total} />

      {query.mode === "list" ? (
        <div className="overflow-hidden rounded-[14px] border border-border bg-surface shadow-[var(--shadow-1)]">
          <StaffList rows={rows} />
        </div>
      ) : (
        <StaffGrid rows={rows} />
      )}

      <Pagination
        label="Staff pages"
        page={page}
        pages={pages}
        total={total}
        per={query.per}
        perOptions={PER_PAGE_OPTIONS}
        href={(patch) => staffHref(query, patch)}
        empty="Nobody matches these filters"
      />
    </div>
  );
}
