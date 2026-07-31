"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Global search. The design filters the inventory list as you type; here the
 * query lives in the URL (`/inventory?q=…`) so a search is shareable, which
 * means it commits on submit rather than on every keystroke.
 */
export function TopbarSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        const trimmed = query.trim();
        router.push(
          trimmed
            ? `/inventory?q=${encodeURIComponent(trimmed)}`
            : "/inventory",
        );
      }}
    >
      <input
        type="search"
        name="q"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search anything here…"
        aria-label="Search inventory"
        className="h-[38px] w-[288px] rounded-[10px] border border-transparent bg-bg px-3.5 text-[13px] font-medium text-text placeholder:text-text-4 focus:border-[#c7d3fd] focus:bg-surface focus:outline-none"
      />
    </form>
  );
}
