import { StaffGrid } from "@/components/staff/StaffGrid";
import { StaffList } from "@/components/staff/StaffList";
import { StaffToolbar } from "@/components/staff/StaffToolbar";
import { Pagination } from "@/components/ui/Pagination";
import { paginate } from "@/lib/shared/pagination";
import {
  PER_PAGE_OPTIONS,
  filterStaff,
  parseStaffQuery,
  staffHref,
} from "@/lib/staff/filters";
import { allStaff } from "@/lib/staff/store";

// Staff list — group filter, search, and the design's two view modes, read out
// of searchParams (group, q, full, mode, page, per) so a narrowed list is a URL
// somebody can send.
//
// Rows and cards link to `/staff/:staffId` carrying those same params, which is
// what lets the profile and the form come back to the list they were opened
// from rather than to an unfiltered page 1.

export default async function StaffPage({ searchParams }: PageProps<"/staff">) {
  const query = parseStaffQuery(await searchParams);

  const matched = filterStaff(allStaff(), query);
  const { rows, page, pages, total } = paginate(matched, query);

  return (
    <div>
      <StaffToolbar query={query} total={total} />

      {query.mode === "list" ? (
        <div className="overflow-hidden rounded-[14px] border border-border bg-surface shadow-[var(--shadow-1)]">
          <StaffList rows={rows} query={query} />
        </div>
      ) : (
        <StaffGrid rows={rows} query={query} />
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
