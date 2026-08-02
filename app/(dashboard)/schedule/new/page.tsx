import Link from "next/link";

import { EntryFormPanel } from "@/components/schedule/EntryFormPanel";
import { secondaryButton } from "@/components/ui/buttons";
import {
  parseScheduleQuery,
  scheduleHref,
  type RawSearchParams,
} from "@/lib/schedule/filters";

// New schedule entry, as a page. The modal at
// `app/(dashboard)/@modal/(.)schedule/new` is what a navigation from inside
// the app gets; this is what a direct visit, a refresh or a shared link gets,
// where there is no calendar behind it to lay a modal over.

// The pickers are built from the stores, which a build-time render would
// freeze at the seed.
export const dynamic = "force-dynamic";

export default async function NewEntryPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const back = scheduleHref(parseScheduleQuery(params));

  return (
    <div className="mx-auto w-full max-w-[720px] overflow-hidden rounded-sm border border-border bg-surface shadow-[var(--shadow-1)]">
      <div className="border-b border-border-soft px-[26px] pt-[22px] pb-[18px]">
        <h2 className="text-xl font-normal tracking-[-0.025em]">New entry</h2>
      </div>
      <EntryFormPanel
        params={params}
        cancel={
          <Link href={back} className={secondaryButton}>
            Cancel
          </Link>
        }
      />
    </div>
  );
}
