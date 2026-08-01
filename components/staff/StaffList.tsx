import { StaffAreas } from "@/components/staff/StaffAreas";
import { StaffDays } from "@/components/staff/StaffDays";
import { Avatar } from "@/components/ui/Avatar";
import type { Staff } from "@/types/staff";

/** The design's fixed column widths; the name column takes what is left. */
const COLUMNS = [
  { label: "NAME", width: undefined },
  { label: "CONTACT", width: 246 },
  { label: "WORKING DAYS", width: 236 },
  { label: "ASSIGNED AREAS", width: 208 },
  { label: "TYPE", width: 122 },
];

/**
 * The staff list as a table.
 *
 * The design's row opens the staff profile dialog and carries a ⋯ menu for
 * "View staff profile" and "Edit info". Neither dialog exists yet, so the row
 * is presentational here rather than a control that goes nowhere — see
 * `docs/structure.md`.
 */
export function StaffList({ rows }: { rows: Staff[] }) {
  return (
    // The design pins the columns and lets the table scroll rather than
    // reflow, so a narrow window slides across it instead of crushing it.
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px] table-fixed border-collapse text-left">
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
                className="px-[18px] py-[11px] text-[10.5px] font-bold tracking-[0.1em] whitespace-nowrap text-text-4"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={COLUMNS.length}
                className="px-[18px] py-10 text-center text-[13px] font-medium text-text-3"
              >
                Nobody matches these filters.
              </td>
            </tr>
          ) : null}

          {rows.map((person) => (
            <tr
              key={person.id}
              className="border-b border-border-soft hover:bg-surface-2"
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
                    <div className="truncate text-[13.5px] font-bold">
                      {person.name}
                    </div>
                    <div className="mt-0.5 truncate text-[11.5px] font-medium text-text-3">
                      {person.role}
                    </div>
                  </div>
                </div>
              </td>

              <td className="px-[18px] py-3">
                <div className="text-[12.5px] font-semibold">
                  {person.phone}
                </div>
                <a
                  href={`mailto:${person.email}`}
                  className="mt-0.5 block truncate text-[12px] font-medium text-accent-fg hover:underline"
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

              <td className="px-[18px] py-3 text-[10.5px] font-bold tracking-[0.04em] whitespace-nowrap uppercase">
                {person.employment}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
