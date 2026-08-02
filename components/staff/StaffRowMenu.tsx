"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { deleteStaff } from "@/app/(dashboard)/staff/actions";
import { Dialog } from "@/components/ui/Dialog";
import { Icon } from "@/components/ui/Icon";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/Menu";

/**
 * The row's ⋯ menu: view the profile, edit, or remove the person.
 *
 * The first two are links, so the menu offers the same destinations the row and
 * the profile already lead to rather than a second way of doing something. The
 * third is the only one that acts, and the only one with nowhere else to live —
 * since the profile became read-only, this menu is the whole of what you can do
 * to a person.
 */
export function StaffRowMenu({
  staffId,
  name,
  profileHref,
  editHref,
}: {
  staffId: string;
  /** Whose row this is — the ⋯ needs to say so out loud. */
  name: string;
  profileHref: string;
  editHref: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
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
            <Link href={profileHref}>
              <Icon name="user" className="size-4 text-text-3" />
              View staff profile
            </Link>
          </MenuItem>
          <MenuItem asChild>
            <Link href={editHref}>
              <Icon name="pencil" className="size-4 text-text-3" />
              Edit info
            </Link>
          </MenuItem>

          <MenuSeparator />

          {/* Opens the confirmation rather than deleting: the menu sits under a
              28px target in a dense table, and one slip on it would otherwise
              be the end of somebody's record. The icon inherits the item's red
              instead of the muted grey the two links use — this is the one
              entry whose colour is the point. */}
          <MenuItem tone="danger" onSelect={() => setConfirming(true)}>
            <Icon name="trash" className="size-4" />
            Delete
          </MenuItem>
        </MenuContent>
      </Menu>

      {confirming ? (
        <Dialog
          title={`Delete ${name}?`}
          onClose={() => setConfirming(false)}
          className="w-[min(420px,calc(100vw-56px))]"
        >
          <div className="px-[26px] pt-4 pb-[26px]">
            <p className="text-[13.5px] font-normal text-text-2">
              This removes {name} from the staff list and from today&rsquo;s
              rota. It cannot be undone.
            </p>

            <div className="mt-6 flex gap-2.5">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="flex h-10 flex-1 items-center justify-center rounded-[10px] border border-border-strong bg-surface text-[13px] font-semibold text-text hover:bg-muted"
              >
                Cancel
              </button>
              {/* The row unmounts with the person, taking this dialog with it,
                  so there is no success state to draw — only the wait. */}
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await deleteStaff(staffId);
                  })
                }
                className="flex h-10 flex-1 items-center justify-center rounded-[10px] bg-badge-red-fg text-[13px] font-semibold text-white hover:brightness-110 disabled:opacity-60"
              >
                {pending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </Dialog>
      ) : null}
    </>
  );
}
