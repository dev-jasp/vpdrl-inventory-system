import { AllDayBand } from "@/components/schedule/AllDayBand";
import { Backlog } from "@/components/schedule/Backlog";
import { DayGrid } from "@/components/schedule/DayGrid";
import { ScheduleHeader } from "@/components/schedule/ScheduleHeader";
import { WeekGrid } from "@/components/schedule/WeekGrid";
import { Icon } from "@/components/ui/Icon";
import { allItems } from "@/lib/inventory/store";
import { scheduleEvents, timed, untimed } from "@/lib/schedule/events";
import {
  backlogEvents,
  entryHref,
  eventsInView,
  parseScheduleQuery,
  visibleDates,
  type RawSearchParams,
} from "@/lib/schedule/filters";
import { lanesFor } from "@/lib/schedule/layout";
import { allEntries } from "@/lib/schedule/store";
import { TODAY, fromISO } from "@/lib/shared/dates";
import { onDuty } from "@/lib/staff/schedule";
import { allStaff } from "@/lib/staff/store";

// Schedule — the lab's dated work in one place: calibrations coming due,
// consignments arriving, and the supplier meetings and paper follow-ups that
// neither of the other two covers.
//
// Nothing in `design/LabTrack Dashboard.dc.html` to port — the design has no
// schedule view and its `navDef` has no entry for one. The layout is taken
// from a resource-calendar reference and rebuilt on this app's primitives and
// tokens; see `docs/adr/0004-schedule.md` for that and for why calibration due
// dates are projected rather than stored.

// The entry store mutates under this page, so it cannot be served from a
// build-time render — the same reason `/inventory` and `/staff` are dynamic.
export const dynamic = "force-dynamic";

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const query = parseScheduleQuery(await searchParams);
  const staff = allStaff();

  // Both halves come from their stores rather than the seeds, so an entry
  // saved in the form and an item whose calibration date moved both count
  // immediately.
  const events = scheduleEvents(allItems(), allEntries(), TODAY, (id) =>
    entryHref(query, id),
  );

  if (query.backlog) {
    const waiting = backlogEvents(events, query);
    return (
      <Page>
        <ScheduleHeader
          query={query}
          staff={staff}
          count={waiting.length}
          onDutyCount={0}
        />
        <Frame>
          <Backlog events={waiting} />
        </Frame>
      </Page>
    );
  }

  const dates = visibleDates(query);
  const inView = eventsInView(events, query);
  const lanes = lanesFor(timed(inView), staff);
  const rostered = onDuty(staff, fromISO(query.date)).length;

  return (
    <Page>
      <ScheduleHeader
        query={query}
        staff={staff}
        count={inView.length}
        onDutyCount={rostered}
      />

      <Frame>
        {query.view === "day" ? (
          <>
            <AllDayBand events={untimed(inView)} />
            {lanes.length > 0 ? (
              <DayGrid lanes={lanes} date={query.date} events={timed(inView)} />
            ) : (
              <Empty
                title="Nothing booked in."
                detail="No window on this day has an hour and an owner against it."
              />
            )}
          </>
        ) : (
          <WeekGrid
            // The week grid draws untimed events as chips in their day cell
            // too — there are no hour rows for a band to sit above.
            lanes={lanesFor(inView, staff)}
            dates={dates}
          />
        )}
      </Frame>
    </Page>
  );
}

function Page({ children }: { children: React.ReactNode }) {
  // The shell's 14px lands 12px short of the design's 26px here, as on
  // `/suppliers`.
  return <div className="flex flex-col gap-[18px] pt-3">{children}</div>;
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-border bg-surface shadow-[var(--shadow-1)]">
      {children}
    </div>
  );
}

function Empty({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 px-6 py-16 text-center">
      <Icon name="calendar" className="size-6 text-text-3" />
      <p className="text-[14px] font-medium">{title}</p>
      <p className="text-[12.5px] font-normal text-text-3">{detail}</p>
    </div>
  );
}
