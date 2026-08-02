import { StaffAreas } from "@/components/staff/StaffAreas";
import { StaffDays } from "@/components/staff/StaffDays";
import { Avatar } from "@/components/ui/Avatar";
import type { Staff } from "@/types/staff";

/**
 * The same people as cards — the design's second view mode. As in the list, the
 * card is presentational: the profile dialog it opens in the mockup does not
 * exist yet.
 */
export function StaffGrid({ rows }: { rows: Staff[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-[14px] border border-border bg-surface px-5 py-10 text-center text-[13px] font-normal text-text-3">
        Nobody matches these filters.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(268px,1fr))] gap-[18px]">
      {rows.map((person) => (
        <li
          key={person.id}
          className="rounded-[14px] border border-border bg-surface px-5 py-[18px] shadow-[var(--shadow-1)]"
        >
          <div className="flex items-center gap-3">
            <Avatar
              id={person.id}
              name={person.name}
              photo={person.photo}
              className="size-[42px] text-[13px]"
            />
            <div className="min-w-0">
              <div className="truncate text-[14px] font-semibold">
                {person.name}
              </div>
              <div className="mt-0.5 truncate text-[11.5px] font-normal text-text-3">
                {person.role}
              </div>
            </div>
            <span className="ml-auto flex-none text-[10px] font-semibold tracking-[0.04em] uppercase">
              {person.employment}
            </span>
          </div>

          <div className="mt-3.5 text-[12.5px] font-medium">{person.phone}</div>
          <a
            href={`mailto:${person.email}`}
            className="mt-0.5 block truncate text-[12px] font-normal text-accent-fg hover:underline"
          >
            {person.email}
          </a>

          <div className="mt-3.5">
            <StaffDays days={person.days} />
          </div>

          <div className="mt-3.5 flex items-baseline gap-1.5 border-t border-border-soft pt-3">
            <span className="text-[11px] font-semibold tracking-[0.1em] text-text-4">
              AREAS
            </span>
            <StaffAreas areas={person.areas} className="ml-auto" />
          </div>
        </li>
      ))}
    </ul>
  );
}
