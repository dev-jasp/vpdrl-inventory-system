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

  function submit(event: React.FormEvent) {
    event.preventDefault();
    // Read the live URL here rather than with `useSearchParams` so the topbar
    // doesn't have to suspend on every prerendered route just to search.
    const params = new URLSearchParams(
      window.location.pathname === "/inventory" ? window.location.search : "",
    );
    const trimmed = query.trim();
    // Searching narrows whatever filter you are already on, as in the design.
    if (trimmed) params.set("q", trimmed);
    else params.delete("q");
    const search = params.toString();
    router.push(search ? `/inventory?${search}` : "/inventory");
  }

  return (
    <form role="search" onSubmit={submit}>
      <input
        type="search"
        name="q"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search anything here…"
        aria-label="Search inventory"
        className="h-[38px] w-[288px] rounded-[10px] border border-transparent bg-bg px-3.5 text-[13px] font-normal text-text placeholder:text-text-4 focus:border-[#c7d3fd] focus:bg-surface focus:outline-none"
      />
    </form>
  );
}
