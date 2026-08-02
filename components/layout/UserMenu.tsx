"use client";

import { Icon, type IconName } from "@/components/ui/Icon";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/Menu";
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

/** Roomier than a row menu's entry, as the design draws the sidebar's. */
const itemClass = "rounded-lg px-3 py-[9px]";

export function UserMenu({
  rail,
  open,
  onOpenChange,
}: {
  rail: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    // Open state still belongs to `Sidebar`, which closes the menu when the
    // rail collapses underneath it.
    <Menu open={open} onOpenChange={onOpenChange}>
      <MenuTrigger>
        <button
          type="button"
          className={cx(
            "flex w-full items-center gap-[10px] rounded-[10px] px-2 py-[7px] text-left outline-none hover:bg-bg data-[state=open]:bg-bg",
            rail ? "justify-center" : "justify-start",
          )}
        >
          <span className="grid size-[34px] flex-none place-items-center rounded-full bg-accent text-xs font-semibold text-white">
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
      </MenuTrigger>

      {/* Above the trigger, which sits at the bottom of the sidebar. */}
      <MenuContent side="top" align="start" className="w-[200px]">
        <MenuLabel className="mb-1 border-b border-border-soft">
          <span className="block text-[12.5px] font-semibold">{USER.name}</span>
          <span className="mt-px block text-[11px] font-normal text-text-3">
            {USER.role}
          </span>
        </MenuLabel>

        {MENU_ITEMS.map((item) => (
          <MenuItem key={item.label} className={itemClass}>
            <Icon name={item.icon} className="size-4 text-text-2" />
            {item.label}
          </MenuItem>
        ))}

        <MenuSeparator />

        <MenuItem className={itemClass}>
          <Icon name="logout" className="size-4" />
          Log out
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
