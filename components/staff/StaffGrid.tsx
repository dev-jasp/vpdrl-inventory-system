import Link from "next/link";

import { StaffAreas } from "@/components/staff/StaffAreas";
import { StaffDays } from "@/components/staff/StaffDays";
import { Avatar } from "@/components/ui/Avatar";
import { type StaffQuery, staffProfileHref } from "@/lib/staff/filters";
import type { Staff } from "@/types/staff";

/**
 * The same people as cards — the design's second view mode. The whole card
 * opens the profile the same way a row does: one link on the name, stretched
 * across the card, with the address raised back above it.
 */
export function StaffGrid({
  rows,
  query,
}: {
  rows: Staff[];
  /** Carried into every link, so Close and Cancel come back to this list. */
  query: StaffQuery;
}) {
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
          className="relative rounded-[14px] border border-border bg-surface px-5 py-[18px] shadow-[var(--shadow-1)] hover:border-accent-fg"
        >
          <div className="flex items-center gap-3">
            <Avatar
              id={person.id}
              name={person.name}
              photo={person.photo}
              className="size-[42px] text-[13px]"
            />
            <div className="min-w-0">
              <Link
                href={staffProfileHref(query, person.id)}
                className="block truncate text-[14px] font-semibold after:absolute after:inset-0 after:content-['']"
              >
                {person.name}
              </Link>
              <div className="mt-0.5 truncate text-[11.5px] font-normal text-text-3">
                {person.role}
              </div>
            </div>
            <span className="ml-auto flex-none text-[10px] font-semibold tracking-[0.04em] uppercase">
              {person.employment}
            </span>
          </div>

          <div className="mt-3.5 text-[12.5px] font-medium">{person.phone}</div>
          {/* Positioned, so it stays clickable through the card's cover. */}
          <a
            href={`mailto:${person.email}`}
            className="relative mt-0.5 block truncate text-[12px] font-normal text-accent-fg hover:underline"
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
