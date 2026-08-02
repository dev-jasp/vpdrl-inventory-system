import Link from "next/link";
import { notFound } from "next/navigation";

import { EntryFormPanel } from "@/components/schedule/EntryFormPanel";
import { secondaryButton } from "@/components/ui/buttons";
import {
  parseScheduleQuery,
  scheduleHref,
  type RawSearchParams,
} from "@/lib/schedule/filters";
import { findEntry } from "@/lib/schedule/store";
import { KIND_LABELS } from "@/types/schedule";

// Edit a schedule entry, as a page — the fall-through for the modal at
// `app/(dashboard)/@modal/(.)schedule/[entryId]/edit`.

export const dynamic = "force-dynamic";

export default async function EditEntryPage({
  params,
  searchParams,
}: {
  params: Promise<{ entryId: string }>;
  searchParams: Promise<RawSearchParams>;
}) {
  const { entryId } = await params;
  const entry = findEntry(decodeURIComponent(entryId));
  if (!entry) notFound();

  const query = await searchParams;
  const back = scheduleHref(parseScheduleQuery(query));

  return (
    <div className="mx-auto w-full max-w-[720px] overflow-hidden rounded-sm border border-border bg-surface shadow-[var(--shadow-1)]">
      <div className="border-b border-border-soft px-[26px] pt-[22px] pb-[18px]">
        <h2 className="text-xl font-normal tracking-[-0.025em]">
          {entry.title}
        </h2>
        <p className="mt-1 text-[10px] font-semibold tracking-[0.12em] text-text-4 uppercase">
          {KIND_LABELS[entry.kind]}
        </p>
      </div>
      <EntryFormPanel
        entry={entry}
        params={query}
        cancel={
          <Link href={back} className={secondaryButton}>
            Cancel
          </Link>
        }
      />
    </div>
  );
}
