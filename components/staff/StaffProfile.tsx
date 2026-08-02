import Link from "next/link";

import { StaffDays } from "@/components/staff/StaffDays";
import { Avatar } from "@/components/ui/Avatar";
import { primaryButton } from "@/components/ui/buttons";
import type { Staff } from "@/types/staff";
import { cx } from "@/utils/cx";

function Section({
  label,
  first,
  children,
}: {
  label: string;
  /** The design opens a little wider off the contract badge than the rules do. */
  first?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cx(
        "w-full border-t border-border-soft pt-[18px] text-left",
        first ? "mt-[22px]" : "mt-[18px]",
      )}
    >
      <h3 className="mb-2.5 text-[11px] font-semibold tracking-[0.1em] text-text-4">
        {label}
      </h3>
      {children}
    </div>
  );
}

/**
 * One person, as the design's profile dialog draws them: the face first, then
 * the three things a colleague looks them up for — how to reach them, when
 * they are in, and where they work.
 *
 * The body is shared between the dialog and the page it falls through to, so
 * the two dismiss differently and nothing else does.
 */
export function StaffProfile({
  person,
  editHref,
  close,
}: {
  person: Staff;
  editHref: string;
  /** The dismiss control, which differs between the page and the dialog. */
  close: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-[26px] pt-1.5 pb-[26px] text-center">
      <Avatar
        id={person.id}
        name={person.name}
        photo={person.photo}
        className="size-[104px] text-[30px]"
      />

      <h2 className="mt-3.5 text-[19px] font-semibold tracking-[-0.02em]">
        {person.name}
      </h2>
      {/* All sans: the id is a code, but it is sitting in a sentence, and no
          line switches family mid-way — see `docs/adr/0001-typography.md`. */}
      <p className="mt-[3px] text-[13px] font-medium text-text-3">
        {person.role} · {person.id}
      </p>
      <p className="mt-2.5 inline-flex rounded-full bg-muted px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.04em] uppercase">
        {person.employment}
      </p>

      <Section label="CONTACT" first>
        <p className="text-[13.5px] font-medium">{person.phone}</p>
        <a
          href={`mailto:${person.email}`}
          className="mt-[3px] block text-[13px] font-normal break-all text-accent-fg hover:underline"
        >
          {person.email}
        </a>
      </Section>

      <Section label="WORKING DAYS">
        <StaffDays days={person.days} large />
      </Section>

      <Section label="ASSIGNED AREAS">
        <p className="text-[13.5px] font-medium">
          {person.areas.length > 0 ? person.areas.join(", ") : "—"}
        </p>
      </Section>

      <div className="mt-6 flex w-full gap-2.5">
        {close}
        <Link
          href={editHref}
          className={cx(primaryButton, "flex-1 justify-center")}
        >
          Edit info
        </Link>
      </div>
    </div>
  );
}
