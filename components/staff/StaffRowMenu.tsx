"use client";

import Link from "next/link";

import { Icon } from "@/components/ui/Icon";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/Menu";

/**
 * The row's ⋯ menu: view the profile, or go straight to editing.
 *
 * Both are links, so the menu offers the same two destinations the row and the
 * profile already lead to rather than a second way of doing something.
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
  return (
    <Menu>
      <MenuTrigger>
        <button
          type="button"
          className="grid size-7 place-items-center rounded-lg border border-transparent text-text-2 outline-none hover:bg-muted data-[state=open]:bg-muted"
        >
          <Icon name="ellipsis" className="size-[18px]" />
          <span className="sr-only">Actions for {name}</span>
        </button>
      </MenuTrigger>

      <MenuContent>
        <MenuItem asChild>
          <Link href={profileHref}>View staff profile</Link>
        </MenuItem>
        <MenuItem asChild>
          <Link href={editHref}>Edit info</Link>
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
