import Link from "next/link";

import { StaffAreas } from "@/components/staff/StaffAreas";
import { StaffDays } from "@/components/staff/StaffDays";
import { StaffRowMenu } from "@/components/staff/StaffRowMenu";
import { Avatar } from "@/components/ui/Avatar";
import {
  type StaffQuery,
  staffEditHref,
  staffProfileHref,
} from "@/lib/staff/filters";
import type { Staff } from "@/types/staff";

/** The design's fixed column widths; the name column takes what is left. */
const COLUMNS = [
  { label: "NAME", width: undefined },
  { label: "CONTACT", width: 246 },
  { label: "WORKING DAYS", width: 236 },
  { label: "ASSIGNED AREAS", width: 208 },
  { label: "TYPE", width: 122 },
  // The ⋯ column, which the design leaves headed by an empty box.
  { label: "Row actions", width: 56, unlabelled: true },
];

/**
 * The staff list as a table.
 *
 * The whole row opens the profile, as it does in the design. That is one link
 * on the name stretched across the row rather than a click handler on the row
 * itself, which is what keeps it a real link — keyboard-reachable, openable in
 * a new tab, and with somewhere to go before JavaScript arrives. Everything
 * else interactive in the row is raised back above that cover.
 */
export function StaffList({
  rows,
  query,
}: {
  rows: Staff[];
  /** Carried into every link, so Close and Cancel come back to this list. */
  query: StaffQuery;
}) {
  return (
    // The design pins the columns and lets the table scroll rather than
    // reflow, so a narrow window slides across it instead of crushing it.
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1156px] table-fixed border-collapse text-left">
        <caption className="sr-only">
          Staff, with rota and assigned zones
        </caption>
        <colgroup>
          {COLUMNS.map((column) => (
            <col
              key={column.label}
              style={column.width ? { width: column.width } : undefined}
            />
          ))}
        </colgroup>

        <thead>
          <tr className="border-b border-border-soft bg-surface-2">
            {COLUMNS.map((column) => (
              <th
                key={column.label}
                scope="col"
                className="px-[18px] py-[11px] text-[10.5px] font-normal tracking-[0.1em] whitespace-nowrap text-text-4"
              >
                {column.unlabelled ? (
                  <span className="sr-only">{column.label}</span>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={COLUMNS.length}
                className="px-[18px] py-10 text-center text-[13px] font-normal text-text-3"
              >
                Nobody matches these filters.
              </td>
            </tr>
          ) : null}

          {rows.map((person) => (
            // Positioned so the profile link can cover the whole row, which is
            // what makes the row clickable without nesting anything
            // interactive inside an anchor.
            <tr
              key={person.id}
              className="relative border-b border-border-soft hover:bg-surface-2"
            >
              <td className="px-[18px] py-3">
                <div className="flex items-center gap-3">
                  <Avatar
                    id={person.id}
                    name={person.name}
                    photo={person.photo}
                    className="size-[38px] text-[12.5px]"
                  />
                  <div className="min-w-0">
                    <Link
                      href={staffProfileHref(query, person.id)}
                      className="block truncate text-[13.5px] font-normal after:absolute after:inset-0 after:content-['']"
                    >
                      {person.name}
                    </Link>
                    <div className="mt-0.5 truncate text-[11.5px] font-normal text-text-3">
                      {person.role}
                    </div>
                  </div>
                </div>
              </td>

              <td className="px-[18px] py-3">
                <div className="text-[12.5px] font-medium">{person.phone}</div>
                {/* Positioned, so it stays clickable through the row's cover. */}
                <a
                  href={`mailto:${person.email}`}
                  className="relative mt-0.5 block truncate text-[12px] font-normal text-accent-fg hover:underline"
                >
                  {person.email}
                </a>
              </td>

              <td className="px-[18px] py-3">
                <StaffDays days={person.days} />
              </td>

              <td className="px-[18px] py-3">
                <div className="flex items-baseline gap-1.5">
                  <StaffAreas areas={person.areas} />
                </div>
              </td>

              <td className="px-[18px] py-3 text-[10.5px] font-normal tracking-[0.04em] whitespace-nowrap uppercase">
                {person.employment}
              </td>

              <td className="relative px-2.5 py-3">
                <div className="flex justify-center">
                  <StaffRowMenu
                    staffId={person.id}
                    name={person.name}
                    profileHref={staffProfileHref(query, person.id)}
                    editHref={staffEditHref(query, person.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
