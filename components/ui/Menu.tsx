"use client";

import * as RadixMenu from "@radix-ui/react-dropdown-menu";

import { cx } from "@/utils/cx";

/**
 * The app's dropdown menus: the row `⋯` in the tables, and the user menu in the
 * sidebar footer.
 *
 * These were three hand-rolled implementations — two on the popover API with
 * `getBoundingClientRect` measured on open, one on its own click-outside
 * effect — each carrying a private copy of the panel styling. Radix supplies
 * the parts that were hard (anchoring that survives a scroll, focus return,
 * arrow keys) and this file supplies the one copy of the look.
 *
 * They are real menus now: `role="menu"`, `role="menuitem"`, arrow-key
 * navigation. The earlier note in `StaffRowMenu` declined that contract on the
 * grounds that it owed a screen reader behaviour we would have to write by
 * hand. Radix writes it, so the objection is settled rather than overruled —
 * see `docs/adr/0005-form-controls.md`.
 */
export const Menu = RadixMenu.Root;

/** Wraps the caller's own button — the trigger's look is never this file's. */
export function MenuTrigger({ children }: { children: React.ReactNode }) {
  return <RadixMenu.Trigger asChild>{children}</RadixMenu.Trigger>;
}

export function MenuContent({
  children,
  align = "end",
  side = "bottom",
  className,
}: {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom";
  className?: string;
}) {
  return (
    <RadixMenu.Portal>
      {/* Portalled, so a menu in the last table row is not clipped by the
          table's `overflow-x` — a box that scrolls sideways scrolls vertically
          too, which is what the popover API was reaching for. Unlike a popover
          this stays anchored to its row while the page scrolls. */}
      <RadixMenu.Content
        align={align}
        side={side}
        sideOffset={8}
        className={cx(
          "z-50 min-w-[180px] rounded-[11px] border border-border bg-surface p-1.5 text-left shadow-[var(--shadow-2)]",
          className,
        )}
      >
        {children}
      </RadixMenu.Content>
    </RadixMenu.Portal>
  );
}

export function MenuItem({
  children,
  asChild,
  className,
}: {
  children: React.ReactNode;
  /** For a `<Link>` — Radix closes the menu on select either way. */
  asChild?: boolean;
  className?: string;
}) {
  return (
    <RadixMenu.Item
      asChild={asChild}
      className={cx(
        "flex cursor-pointer items-center gap-[10px] rounded-[7px] px-2.5 py-2 text-[13px] font-medium text-text outline-none select-none",
        "data-[highlighted]:bg-muted",
        className,
      )}
    >
      {children}
    </RadixMenu.Item>
  );
}

export function MenuSeparator({ className }: { className?: string }) {
  return (
    <RadixMenu.Separator
      className={cx("mx-1 my-[5px] h-px bg-muted", className)}
    />
  );
}

/** A non-interactive heading — the user menu's name and role block. */
export function MenuLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <RadixMenu.Label className={cx("px-3 py-2.5", className)}>
      {children}
    </RadixMenu.Label>
  );
}
