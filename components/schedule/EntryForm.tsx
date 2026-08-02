"use client";

import { useActionState, useId, useState } from "react";

import { saveScheduleEntry } from "@/app/(dashboard)/schedule/actions";
import { inputFocus, primaryButton } from "@/components/ui/buttons";
import { Select } from "@/components/ui/Select";
import {
  DEFAULT_DURATION,
  DURATIONS,
  type SaveScheduleState,
} from "@/lib/schedule/form";
import {
  ENTRY_STATUSES,
  KIND_LABELS,
  SCHEDULE_KINDS,
  type ScheduleEntry,
  type ScheduleKind,
} from "@/types/schedule";
import type { Staff } from "@/types/staff";
import { cx } from "@/utils/cx";

const fieldClass = cx(
  "h-10 w-full rounded-md border border-border-strong bg-surface px-[13px] text-[13px] font-normal text-text",
  inputFocus,
);

const labelClass = "mb-1.5 block text-[12px] font-medium text-text-2";

/**
 * Add or edit a schedule entry. `entry` absent means add.
 *
 * Three things here need React state rather than the uncontrolled inputs the
 * supplier form gets away with: the kind chips decide whether the instrument
 * picker is shown at all, and the start time decides whether a duration means
 * anything. Leaving a window blank is a legitimate answer — that is what keeps
 * an entry in the all-day band until somebody knows the hour — so the form
 * says so rather than treating it as a field somebody forgot.
 */
export function EntryForm({
  entry,
  staff,
  suppliers,
  calibratable,
  defaultDate,
  defaultKind,
  cancel,
  back,
}: {
  entry?: ScheduleEntry;
  staff: Staff[];
  suppliers: string[];
  /** Items that carry a calibration date, for a booking to point at. */
  calibratable: { id: string; name: string }[];
  defaultDate: string;
  defaultKind: ScheduleKind;
  /** The dismiss control, which differs between the page and the dialog. */
  cancel: React.ReactNode;
  /** Where a finished save lands — the calendar the form was opened from. */
  back: string;
}) {
  const [state, formAction, pending] = useActionState<
    SaveScheduleState,
    FormData
  >(saveScheduleEntry.bind(null, entry?.id ?? null, back), {});

  const ids = useId();
  const submitted = state.values;
  const valueOf = (name: string, fallback: string) =>
    submitted?.[name] ?? fallback;

  const [kind, setKind] = useState<ScheduleKind>(
    (submitted?.kind as ScheduleKind) ?? entry?.kind ?? defaultKind,
  );
  const [start, setStart] = useState(
    valueOf("start", entry?.start ?? ""),
  );

  const field = (name: string) => `${ids}-${name}`;
  const error = (name: keyof NonNullable<typeof state.errors>) =>
    state.errors?.[name];

  return (
    <form action={formAction} className="px-[26px] pt-[22px] pb-6">
      {error("form") ? (
        <p
          role="alert"
          className="mb-5 rounded-[10px] bg-badge-red-bg px-3 py-2.5 text-[12.5px] font-medium text-badge-red-fg"
        >
          {error("form")}
        </p>
      ) : null}

      <fieldset className="mb-[18px]">
        <legend className={labelClass}>Kind</legend>
        <input type="hidden" name="kind" value={kind} />
        <div className="flex flex-wrap gap-2">
          {SCHEDULE_KINDS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setKind(option)}
              aria-pressed={kind === option}
              className={cx(
                "h-9 rounded-md border px-3.5 text-[12.5px] font-medium",
                kind === option
                  ? "border-accent-fg bg-tint-blue text-accent-fg"
                  : "border-border-strong bg-surface text-text-2 hover:bg-muted",
              )}
            >
              {KIND_LABELS[option]}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-x-5 gap-y-[18px]">
        <div className="col-span-2">
          <label htmlFor={field("title")} className={labelClass}>
            {kind === "CAL" ? "Instrument" : "What is it"}
          </label>
          <input
            id={field("title")}
            name="title"
            defaultValue={valueOf("title", entry?.title ?? "")}
            placeholder={
              kind === "MTG" ? "Quarterly account review" : "Reagent consignment"
            }
            aria-invalid={error("title") ? true : undefined}
            className={cx(
              fieldClass,
              error("title") && "border-[#dc2626] focus:border-[#dc2626]",
            )}
          />
          <FieldError message={error("title")} />
        </div>

        {kind === "CAL" ? (
          <div className="col-span-2">
            <label htmlFor={field("itemId")} className={labelClass}>
              Books the calibration due on
            </label>
            <Select
              id={field("itemId")}
              name="itemId"
              label="Books the calibration due on"
              defaultValue={valueOf("itemId", entry?.itemId ?? "")}
              placeholder="Choose an instrument…"
              options={calibratable.map((item) => ({
                value: item.id,
                label: `${item.id} · ${item.name}`,
              }))}
              className={cx(fieldClass, "cursor-pointer")}
            />
            <FieldError message={error("itemId")} />
            <p className="mt-1.5 text-[11.5px] font-normal text-text-3">
              The due date stays on the item. This is the appointment to do it.
            </p>
          </div>
        ) : null}

        <div>
          <label htmlFor={field("date")} className={labelClass}>
            Date
          </label>
          <input
            id={field("date")}
            name="date"
            type="date"
            defaultValue={valueOf("date", entry?.date ?? defaultDate)}
            aria-invalid={error("date") ? true : undefined}
            className={cx(
              fieldClass,
              "font-mono font-extrabold",
              error("date") && "border-[#dc2626] focus:border-[#dc2626]",
            )}
          />
          <FieldError message={error("date")} />
        </div>

        <div>
          <label htmlFor={field("status")} className={labelClass}>
            Status
          </label>
          <Select
            id={field("status")}
            name="status"
            label="Status"
            defaultValue={valueOf("status", entry?.status ?? "Tentative")}
            options={ENTRY_STATUSES.map((option) => ({
              value: option,
              label: option,
            }))}
            className={cx(fieldClass, "cursor-pointer")}
          />
        </div>

        <div>
          <label htmlFor={field("start")} className={labelClass}>
            Start time
          </label>
          <input
            id={field("start")}
            name="start"
            type="time"
            value={start}
            onChange={(event) => setStart(event.target.value)}
            aria-invalid={error("start") ? true : undefined}
            className={cx(
              fieldClass,
              "font-mono font-extrabold",
              error("start") && "border-[#dc2626] focus:border-[#dc2626]",
            )}
          />
          <FieldError message={error("start")} />
        </div>

        <div>
          <label htmlFor={field("minutes")} className={labelClass}>
            Length
          </label>
          <Select
            id={field("minutes")}
            name="minutes"
            label="Length"
            defaultValue={valueOf(
              "minutes",
              String(entry?.minutes ?? DEFAULT_DURATION),
            )}
            disabled={!start}
            options={DURATIONS.map((minutes) => ({
              value: String(minutes),
              label: `${minutes} min`,
            }))}
            className={cx(fieldClass, "cursor-pointer")}
          />
        </div>

        <div className="col-span-2 -mt-2">
          <p className="text-[11.5px] font-normal text-text-3">
            {start
              ? "With a window and an owner this sits in the day grid."
              : "No start time: this waits in the all-day band until somebody pins one."}
          </p>
        </div>

        <div>
          <label htmlFor={field("ownerId")} className={labelClass}>
            Owner
          </label>
          <Select
            id={field("ownerId")}
            name="ownerId"
            label="Owner"
            defaultValue={valueOf("ownerId", entry?.ownerId ?? "")}
            options={[
              { value: "", label: "Unassigned" },
              ...staff.map((person) => ({
                value: person.id,
                label: `${person.name} · ${person.role}`,
              })),
            ]}
            className={cx(fieldClass, "cursor-pointer")}
          />
        </div>

        <div>
          <label htmlFor={field("supplier")} className={labelClass}>
            Supplier
          </label>
          <Select
            id={field("supplier")}
            name="supplier"
            label="Supplier"
            defaultValue={valueOf("supplier", entry?.supplier ?? "")}
            options={[
              { value: "", label: "None" },
              ...suppliers.map((name) => ({ value: name, label: name })),
            ]}
            className={cx(fieldClass, "cursor-pointer")}
          />
        </div>

        <div className="col-span-2">
          <label htmlFor={field("reference")} className={labelClass}>
            Reference
          </label>
          <input
            id={field("reference")}
            name="reference"
            defaultValue={valueOf("reference", entry?.reference ?? "")}
            placeholder="PO-2026-014, RFQ-118"
            // A document number is a reading, not prose.
            className={cx(fieldClass, "font-mono font-extrabold")}
          />
          <p className="mt-1.5 text-[11.5px] font-normal text-text-3">
            Free text — there is no purchase order record to point at yet.
          </p>
        </div>

        <div className="col-span-2">
          <label htmlFor={field("note")} className={labelClass}>
            Note
          </label>
          <textarea
            id={field("note")}
            name="note"
            rows={3}
            defaultValue={valueOf("note", entry?.note ?? "")}
            placeholder="Anything whoever picks this up needs to know."
            className={cx(fieldClass, "h-auto py-2.5 leading-[1.5]")}
          />
        </div>
      </div>

      <div className="mt-[26px] flex justify-end gap-2.5 border-t border-border-soft pt-5">
        {cancel}
        <button type="submit" disabled={pending} className={primaryButton}>
          {pending ? "Saving…" : "Save entry"}
        </button>
      </div>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-[11.5px] font-medium text-[#dc2626]">
      {message}
    </p>
  );
}
