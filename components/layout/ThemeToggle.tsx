"use client";

import { Icon } from "@/components/ui/Icon";

/**
 * Flips `data-theme` on <html> and remembers the choice. The current theme is
 * never held in React state: both icons render and CSS picks one, so the
 * button matches the pre-hydration theme set by the script in the root layout.
 */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private mode or blocked storage — the theme still applies this session.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="grid size-[38px] flex-none place-items-center rounded-[10px] border border-border bg-surface text-text-2 hover:bg-muted"
    >
      <Icon name="sun" className="size-[17px] dark:hidden" />
      <Icon name="moon" className="hidden size-[17px] dark:block" />
      <span className="sr-only dark:hidden">Switch to dark theme</span>
      <span className="sr-only hidden dark:block">Switch to light theme</span>
    </button>
  );
}
