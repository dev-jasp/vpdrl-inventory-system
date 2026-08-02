"use client";

import { useRouter } from "next/navigation";

import { inputFocus } from "@/components/ui/buttons";
import { type StaffQuery, staffHref } from "@/lib/staff/filters";
import { cx } from "@/utils/cx";

/**
 * The staff list's own search box — the topbar's search goes to the inventory.
 *
 * The design filters as you type; here the query lives in the URL so a search
 * is shareable, which means it commits on submit. Uncontrolled, so the field is
 * the browser's to keep; the caller keys it on `query.q` to reset it when the
 * URL changes underneath.
 */
export function StaffSearch({ query }: { query: StaffQuery }) {
  const router = useRouter();

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        const value = new FormData(event.currentTarget).get("q");
        router.push(
          staffHref(query, {
            q: typeof value === "string" ? value.trim() : "",
          }),
        );
      }}
    >
      <input
        type="search"
        name="q"
        defaultValue={query.q}
        placeholder="Search name, email, or phone"
        aria-label="Search staff"
        className={cx(
          "h-9.5 w-[300px] max-w-full rounded-md border border-border-strong bg-surface px-[13px] text-[13px] font-normal text-text placeholder:text-text-4",
          inputFocus,
        )}
      />
    </form>
  );
}
