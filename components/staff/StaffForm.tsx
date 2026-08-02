"use client";

import { useActionState, useId, useState } from "react";

import { saveStaff } from "@/app/(dashboard)/staff/actions";
import { StaffPhotoField } from "@/components/staff/StaffPhotoField";
import { inputFocus, primaryButton } from "@/components/ui/buttons";
import {
  DEFAULT_DAYS,
  EMPLOYMENT_TYPES,
  GROUP_CHIPS,
  STAFF_FORM_FIELDS,
  type SaveStaffState,
} from "@/lib/staff/form";
import { DAY_LABELS, DAY_NAMES } from "@/lib/staff/schedule";
import type { EmploymentType, Staff, StaffGroup } from "@/types/staff";
import { cx } from "@/utils/cx";

const inputClass = cx(
  "h-10 w-full rounded-md border border-border-strong bg-surface px-[13px] text-[13px] font-normal text-text",
  inputFocus,
);

const legendClass = "text-[10px] font-semibold tracking-[0.12em] text-text-4";

/** Written out, because Tailwind reads the class names it finds in the source. */
const SPAN_CLASS = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
} as const;

function chipClass(active: boolean) {
  return cx(
    "inline-flex h-[33px] items-center rounded-full border px-3.5 text-[12.5px] font-medium",
    active
      ? "border-tint-blue bg-tint-blue text-accent-fg"
      : "border-border-strong bg-surface text-text-2 hover:bg-muted",
  );
}

/**
 * Add or edit a member of staff. `person` absent means add.
 *
 * The three things that are not text — team, contract and the rota — are React
 * state, because a chip and a day toggle have no input of their own to live
 * in; each is posted through a hidden field. The text fields are left
 * uncontrolled, so the browser keeps them and a failed save redraws with the
 * values it was given.
 */
export function StaffForm({
  person,
  back,
  group: initialGroup,
  cancel,
}: {
  person?: Staff;
  /** The list to land on once saved, carrying the filters it was opened from. */
  back: string;
  /** Which team a new starter joins — the one the list is filtered to. */
  group?: StaffGroup;
  /** The dismiss control, which differs between the page and the dialog. */
  cancel: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState<SaveStaffState, FormData>(
    saveStaff.bind(null, person?.id ?? null, back),
    {},
  );

  const submitted = state.values;
  const [group, setGroup] = useState<StaffGroup>(
    (submitted?.group as StaffGroup) ?? person?.group ?? initialGroup ?? "tech",
  );
  const [employment, setEmployment] = useState<EmploymentType>(
    (submitted?.employment as EmploymentType) ??
      person?.employment ??
      "Full-time",
  );
  const [days, setDays] = useState(
    submitted?.days ?? person?.days ?? DEFAULT_DAYS,
  );
  const errorId = useId();

  const initial: Record<string, string> = {
    name: person?.name ?? "",
    role: person?.role ?? "",
    phone: person?.phone ?? "",
    email: person?.email ?? "",
    areas: person?.areas.join(", ") ?? "",
  };
  const valueOf = (name: string) => submitted?.[name] ?? initial[name] ?? "";

  function toggleDay(index: number) {
    setDays((current) =>
      current
        .split("")
        .map((on, at) => (at === index ? (on === "1" ? "0" : "1") : on))
        .join(""),
    );
  }

  return (
    <form action={formAction} className="px-[26px] pt-[22px] pb-6">
      <StaffPhotoField initial={submitted?.photo ?? person?.photo} />

      <input type="hidden" name="group" value={group} />
      <input type="hidden" name="employment" value={employment} />
      <input type="hidden" name="days" value={days} />

      {state.errors?.form ? (
        <p
          role="alert"
          className="mb-5 rounded-[10px] bg-badge-red-bg px-3 py-2.5 text-[12.5px] font-medium text-badge-red-fg"
        >
          {state.errors.form}
        </p>
      ) : null}

      <div className="grid grid-cols-3 gap-x-5 gap-y-[18px]">
        {STAFF_FORM_FIELDS.map((field) => {
          const error = state.errors?.[field.name];
          const describedBy = error ? `${errorId}-${field.name}` : undefined;

          return (
            <div key={field.name} className={SPAN_CLASS[field.span]}>
              <label
                htmlFor={`${errorId}-${field.name}-input`}
                className="mb-1.5 block text-[12px] font-medium text-text-2"
              >
                {field.label}
              </label>
              <input
                id={`${errorId}-${field.name}-input`}
                name={field.name}
                defaultValue={valueOf(field.name)}
                placeholder={field.placeholder}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                className={cx(
                  inputClass,
                  error && "border-[#dc2626] focus:border-[#dc2626]",
                )}
              />
              {error ? (
                <p
                  id={describedBy}
                  className="mt-1.5 text-[11.5px] font-medium text-[#dc2626]"
                >
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-[22px] flex flex-wrap gap-x-[34px] gap-y-5">
        <fieldset>
          <legend className={legendClass}>TEAM</legend>
          <div className="mt-2.5 flex gap-2">
            {GROUP_CHIPS.map((chip) => (
              <button
                key={chip.value}
                type="button"
                aria-pressed={group === chip.value}
                onClick={() => setGroup(chip.value)}
                className={chipClass(group === chip.value)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={legendClass}>CONTRACT</legend>
          <div className="mt-2.5 flex gap-2">
            {EMPLOYMENT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                aria-pressed={employment === type}
                onClick={() => setEmployment(type)}
                className={chipClass(employment === type)}
              >
                {type}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={legendClass}>WORKING DAYS</legend>
          {/* Each toggle is named in full: "T" and "S" each stand for two
              days, so the letter alone is only legible next to the others. */}
          <div className="mt-2.5 flex gap-[7px]">
            {DAY_NAMES.map((letter, index) => {
              const on = days[index] === "1";
              return (
                <button
                  key={letter}
                  type="button"
                  aria-pressed={on}
                  aria-label={DAY_LABELS[index]}
                  onClick={() => toggleDay(index)}
                  className={cx(
                    "size-[33px] flex-none rounded-full border text-[11px] font-semibold",
                    on
                      ? "border-accent bg-accent text-white"
                      : "border-border-strong bg-surface text-text-3 hover:bg-muted",
                  )}
                >
                  <span aria-hidden>{letter}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="mt-[26px] flex justify-end gap-2.5 border-t border-border-soft pt-5">
        {cancel}
        <button type="submit" disabled={pending} className={primaryButton}>
          {pending ? "Saving…" : "Save staff"}
        </button>
      </div>
    </form>
  );
}
