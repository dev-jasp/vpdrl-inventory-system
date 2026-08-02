import {
  DialogCancel,
  EntryFormDialog,
} from "@/components/schedule/EntryFormDialog";
import { EntryFormPanel } from "@/components/schedule/EntryFormPanel";
import type { RawSearchParams } from "@/lib/schedule/filters";

// `/schedule/new` reached from inside the app: the form as a modal over the
// calendar. A direct visit or a refresh falls through to the full page at
// `app/(dashboard)/schedule/new`.

export default async function NewEntryModal({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;

  return (
    <EntryFormDialog title="New entry">
      <EntryFormPanel params={params} cancel={<DialogCancel />} />
    </EntryFormDialog>
  );
}
