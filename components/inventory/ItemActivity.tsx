import { Card, CardTitle } from "@/components/ui/Card";
import type { ActivityEntry } from "@/lib/inventory/activity";

/** What has happened to this item lately, most recent first. */
export function ItemActivity({ entries }: { entries: ActivityEntry[] }) {
  return (
    <Card className="pb-2.5">
      <CardTitle>Activity</CardTitle>
      <ul className="mt-2">
        {entries.map((entry) => (
          <li
            key={`${entry.date}-${entry.text}`}
            className="grid grid-cols-[112px_minmax(0,1fr)_140px] gap-3 border-t border-border-soft py-[11px] text-[12.5px]"
          >
            <span className="font-mono font-medium text-text-3">
              {entry.date}
            </span>
            <span className="font-normal">{entry.text}</span>
            <span className="text-right font-medium text-text-3">
              {entry.who}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
