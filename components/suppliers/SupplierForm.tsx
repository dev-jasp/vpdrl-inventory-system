"use client";

import { useActionState, useId } from "react";

import { saveSupplier } from "@/app/(dashboard)/suppliers/actions";
import {
  DEFAULT_LEAD_DAYS,
  DEFAULT_ON_TIME,
  SUPPLIER_FORM_FIELDS,
  type SaveSupplierState,
} from "@/lib/suppliers/form";
import type { Supplier } from "@/types/supplier";
import { cx } from "@/utils/cx";

const inputClass =
  "h-10 w-full rounded-[10px] border border-border-strong bg-surface px-[13px] text-[13px] font-normal text-text outline-none focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,.16)]";

/**
 * Add or edit a supplier. `supplier` absent means add.
 *
 * Every field is text, so all of them are left uncontrolled: the browser keeps
 * what was typed, and a rejected save redraws from the values the action hands
 * back. There is nothing here that needs React state, unlike the staff form's
 * chips and rota.
 */
export function SupplierForm({
  supplier,
  cancel,
}: {
  supplier?: Supplier;
  /** The dismiss control, which differs between the page and the dialog. */
  cancel: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState<
    SaveSupplierState,
    FormData
  >(saveSupplier.bind(null, supplier?.name ?? null), {});

  const errorId = useId();
  const submitted = state.values;

  // The design opens the add form on 95% and 5 days rather than on blanks —
  // the numbers a supplier is assumed good for until delivery says otherwise.
  const initial: Record<string, string> = {
    name: supplier?.name ?? "",
    contact: supplier?.contact ?? "",
    email: supplier?.email ?? "",
    phone: supplier?.phone ?? "",
    leadDays: String(supplier?.leadDays ?? DEFAULT_LEAD_DAYS),
    onTime: String(supplier?.onTime ?? DEFAULT_ON_TIME),
  };
  const valueOf = (name: string) => submitted?.[name] ?? initial[name] ?? "";

  return (
    <form action={formAction} className="px-[26px] pt-[22px] pb-6">
      {state.errors?.form ? (
        <p
          role="alert"
          className="mb-5 rounded-[10px] bg-badge-red-bg px-3 py-2.5 text-[12.5px] font-medium text-badge-red-fg"
        >
          {state.errors.form}
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-x-5 gap-y-[18px]">
        {SUPPLIER_FORM_FIELDS.map((field) => {
          const error = state.errors?.[field.name];
          const describedBy = error ? `${errorId}-${field.name}` : undefined;

          return (
            <div
              key={field.name}
              className={field.span === 2 ? "col-span-2" : "col-span-1"}
            >
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
                // Text rather than `type="number"`, as the design draws it;
                // the value is checked on the server either way.
                inputMode={
                  "numeric" in field && field.numeric ? "numeric" : undefined
                }
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                className={cx(
                  inputClass,
                  "mono" in field && field.mono && "font-mono",
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

      {/* Renaming is the one edit here that reaches beyond this record, and
          the reader cannot see the catalogue from inside the dialog. */}
      {supplier ? (
        <p className="mt-4 text-[11.5px] font-normal text-text-3">
          Renaming a supplier carries its items across with it.
        </p>
      ) : null}

      <div className="mt-[26px] flex justify-end gap-2.5 border-t border-border-soft pt-5">
        {cancel}
        <button
          type="submit"
          disabled={pending}
          className="flex h-10 items-center rounded-[10px] bg-[#3b82f6] px-5 text-[13px] font-semibold text-white hover:bg-[#2563eb] disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save supplier"}
        </button>
      </div>
    </form>
  );
}
