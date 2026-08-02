"use client";

import { useRouter } from "next/navigation";

import { type StaffQuery, staffHref } from "@/lib/staff/filters";

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
        className="h-[38px] w-[300px] max-w-full rounded-[10px] border border-border-strong bg-surface px-[13px] text-[13px] font-normal text-text outline-none placeholder:text-text-4 focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,.16)]"
      />
    </form>
  );
}
