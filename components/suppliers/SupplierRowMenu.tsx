"use client";

import Link from "next/link";

import { Icon } from "@/components/ui/Icon";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/Menu";

/**
 * The row's ⋯ menu. One entry, as the design has it: the row itself already
 * leads to the catalogue, so "Edit supplier" is the only thing the menu adds.
 */
export function SupplierRowMenu({
  name,
  editHref,
}: {
  /** Whose row this is — the ⋯ needs to say so out loud. */
  name: string;
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

      {/* Narrower than the default: one short entry, as the design draws it. */}
      <MenuContent className="min-w-[150px]">
        <MenuItem asChild>
          <Link href={editHref}>Edit supplier</Link>
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
