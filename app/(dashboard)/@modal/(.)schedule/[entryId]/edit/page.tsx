import { notFound } from "next/navigation";

import {
  DialogCancel,
  EntryFormDialog,
} from "@/components/schedule/EntryFormDialog";
import { EntryFormPanel } from "@/components/schedule/EntryFormPanel";
import type { RawSearchParams } from "@/lib/schedule/filters";
import { findEntry } from "@/lib/schedule/store";
import { KIND_LABELS } from "@/types/schedule";

// `/schedule/:entryId/edit` reached from inside the app: the form as a modal
// over the calendar. Every card on the calendar links here.

export default async function EditEntryModal({
  params,
  searchParams,
}: {
  params: Promise<{ entryId: string }>;
  searchParams: Promise<RawSearchParams>;
}) {
  const { entryId } = await params;
  const entry = findEntry(decodeURIComponent(entryId));
  if (!entry) notFound();

  return (
    <EntryFormDialog title={entry.title} subtitle={KIND_LABELS[entry.kind]}>
      <EntryFormPanel
        entry={entry}
        params={await searchParams}
        cancel={<DialogCancel />}
      />
    </EntryFormDialog>
  );
}
