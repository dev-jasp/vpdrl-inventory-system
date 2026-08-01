"use client";

import { useEffect, useId } from "react";

import { Icon, type IconName } from "@/components/ui/Icon";
import { initials } from "@/lib/shared/names";
import { cx } from "@/utils/cx";

// Placeholder identity, taken from the design's `userName` prop. Replace with
// the signed-in user once there is an auth story.
const USER = { name: "Dr. Jane Davis", role: "Lab Director" };

const MENU_ITEMS: { label: string; icon: IconName }[] = [
  { label: "Account", icon: "account" },
  { label: "Billing", icon: "billing" },
  { label: "Notifications", icon: "bell" },
];

export function UserMenu({
  rail,
  open,
  onOpenChange,
}: {
  rail: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onOpenChange(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        className={cx(
          "flex w-full items-center gap-[10px] rounded-[10px] px-2 py-[7px] text-left hover:bg-bg",
          rail ? "justify-center" : "justify-start",
        )}
      >
        <span className="grid size-[34px] flex-none place-items-center rounded-full bg-[#3b82f6] text-xs font-semibold text-white">
          {initials(USER.name)}
        </span>
        {rail ? (
          <span className="sr-only">{USER.name}</span>
        ) : (
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12.5px] leading-[1.25] font-semibold">
              {USER.name}
            </span>
            <span className="block text-[10.5px] font-normal text-text-3">
              {USER.role}
            </span>
          </span>
        )}
      </button>

      {/* Plain buttons rather than role="menu"/"menuitem": that contract owes a
          screen reader arrow-key navigation and focus management, and Tab
          through ordinary buttons is honest about what this does. */}
      {open ? (
        <>
          <div
            className="fixed inset-0 z-[19]"
            onClick={() => onOpenChange(false)}
            aria-hidden
          />
          <div
            id={menuId}
            className="absolute bottom-[52px] left-0 z-20 w-[200px] rounded-xl border border-border bg-surface p-1.5 shadow-[var(--shadow-2)]"
          >
            <div className="mb-1 border-b border-border-soft px-3 py-2.5">
              <div className="text-[12.5px] font-semibold">{USER.name}</div>
              <div className="mt-px text-[11px] font-normal text-text-3">
                {USER.role}
              </div>
            </div>
            {MENU_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                className="flex w-full items-center gap-[10px] rounded-lg px-3 py-[9px] text-[13px] font-medium text-text hover:bg-bg"
              >
                <Icon name={item.icon} className="size-4 text-text-2" />
                {item.label}
              </button>
            ))}
            <div className="mx-1 my-[5px] h-px bg-muted" />
            <button
              type="button"
              className="flex w-full items-center gap-[10px] rounded-lg px-3 py-[9px] text-[13px] font-medium text-text hover:bg-bg"
            >
              <Icon name="logout" className="size-4" />
              Log out
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
