"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Icon } from "@/components/ui/Icon";

/** The design's menu width, needed here to hang it off the button's right. */
const WIDTH = 180;

const itemClass =
  "block rounded-[7px] px-2.5 py-2 text-[13px] font-medium text-text hover:bg-muted";

/**
 * The row's ⋯ menu: view the profile, or go straight to editing.
 *
 * Both are links, so the menu offers the same two destinations the row and the
 * profile already lead to rather than a second way of doing something.
 *
 * It is a `popover`, which puts it in the top layer. An absolutely positioned
 * menu would be clipped by the table's horizontal scroll container — `overflow-x`
 * on a box makes its `overflow-y` a scroller too, so the last row's menu would
 * be cut off at the bottom of the table. The top layer sits outside all of
 * that, and the browser handles the light dismiss and Escape while it is up.
 * The cost is that a popover is positioned against the viewport, so the
 * coordinates are measured on open and the menu closes on scroll rather than
 * drifting away from the row it belongs to.
 */
export function StaffRowMenu({
  name,
  profileHref,
  editHref,
}: {
  /** Whose row this is — the ⋯ needs to say so out loud. */
  name: string;
  profileHref: string;
  editHref: string;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    const button = buttonRef.current;
    const menu = menuRef.current;
    if (!open || !button || !menu) return;

    const rect = button.getBoundingClientRect();
    menu.style.top = `${rect.bottom + 8}px`;
    menu.style.left = `${Math.max(8, rect.right - WIDTH)}px`;
    // Absent on a browser without the popover API, where the menu is an
    // ordinary fixed box that the state above shows and hides.
    menu.showPopover?.();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    // The browser's own dismissals — a click elsewhere, Escape — close the
    // popover without going through this component, so follow it back.
    const menu = menuRef.current;
    const onToggle = (event: Event) => {
      if ((event as ToggleEvent).newState === "closed") setOpen(false);
    };
    // Escape for the fallback path, where nothing else is listening for it.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const close = () => setOpen(false);

    menu?.addEventListener("toggle", onToggle);
    document.addEventListener("keydown", onKeyDown);
    // Capture: the table scrolls sideways in its own box, not just the page.
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);

    return () => {
      menu?.removeEventListener("toggle", onToggle);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="grid size-7 place-items-center rounded-lg border border-transparent text-text-2 hover:bg-muted"
      >
        <Icon name="ellipsis" className="size-[18px]" />
        <span className="sr-only">Actions for {name}</span>
      </button>

      {open ? (
        <div
          ref={menuRef}
          popover="auto"
          style={{ width: WIDTH }}
          className="fixed m-0 rounded-[11px] border border-border bg-surface p-1.5 text-left shadow-[var(--shadow-2)]"
        >
          {/* Plain links rather than role="menu"/"menuitem": that contract owes
              a screen reader arrow-key navigation and focus management, and Tab
              through ordinary links is honest about what this does. */}
          <Link
            href={profileHref}
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            View staff profile
          </Link>
          <Link
            href={editHref}
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            Edit info
          </Link>
        </div>
      ) : null}
    </>
  );
}
