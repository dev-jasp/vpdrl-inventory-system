"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { useState } from "react";

import { Icon } from "@/components/ui/Icon";
import { cx } from "@/utils/cx";

export type SelectOption = {
  value: string;
  label: string;
};

/**
 * Radix reserves the empty string: an item cannot carry `value=""`, because
 * that is what it uses internally to mean "nothing is selected". Several of
 * these dropdowns have a real, choosable empty — "Unassigned", "None" — which a
 * native `<select>` expresses as `<option value="">`. So `""` is swapped for
 * this sentinel on the way in and swapped back on the way out, and nothing
 * outside this file ever sees it.
 */
const EMPTY = "__empty__";

/**
 * A dropdown that renders its own list instead of the platform's.
 *
 * A native `<select>` is stylable while it is shut and not while it is open:
 * the popup belongs to the OS, so it ignores the token layer and — the reason
 * this exists — it does not follow the theme. On several platforms the option
 * list stays light while the app around it is dark. See
 * `docs/adr/0005-form-controls.md` for why this is Radix rather than shadcn.
 *
 * The closed box keeps the design's dimensions; the caller passes them, because
 * the design gives this control four different heights and radii depending on
 * where it sits. What is fixed here is the popup, which the design never drew.
 *
 * Give it a `name` for a form field and it posts through a hidden input, so the
 * server action receives the same `FormData` it always did. Give it `value` and
 * `onValueChange` where something else on the screen reads the choice. Both at
 * once is fine — the schedule form needs the kind to post *and* to switch which
 * fields are on screen.
 */
export function Select({
  id,
  label,
  name,
  value,
  defaultValue,
  onValueChange,
  options,
  placeholder,
  disabled,
  className,
  align = "start",
}: {
  /** Set when a visible `<label htmlFor>` points at this. */
  id?: string;
  /** Accessible name — most of these sit in toolbars with no visible label. */
  label: string;
  /** Set for a form field, so the choice posts. Omit for a control. */
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  /** Shown when the value matches no option. */
  placeholder?: string;
  disabled?: boolean;
  /** The trigger's height, radius and padding, which vary by placement. */
  className?: string;
  align?: "start" | "end";
}) {
  // Tracked even when uncontrolled, because the hidden input has to know what
  // to post. `value` still wins when the caller passes one.
  const [internal, setInternal] = useState(defaultValue ?? "");
  const current = value ?? internal;

  return (
    <RadixSelect.Root
      value={current === "" ? EMPTY : current}
      disabled={disabled}
      onValueChange={(next) => {
        const picked = next === EMPTY ? "" : next;
        if (value === undefined) setInternal(picked);
        onValueChange?.(picked);
      }}
    >
      {name ? <input type="hidden" name={name} value={current} /> : null}

      <RadixSelect.Trigger
        id={id}
        aria-label={label}
        className={cx(
          "group flex cursor-pointer items-center gap-2 border border-border-strong bg-surface px-3 text-[12.5px] font-medium text-text",
          "outline-none focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_color-mix(in_oklch,var(--accent)_22%,transparent)]",
          "disabled:cursor-default disabled:opacity-50 data-[state=open]:border-accent",
          className,
        )}
      >
        {/* `min-w-0` so a long label truncates instead of stretching a trigger
            whose width the toolbar layout is counting on. */}
        <span className="min-w-0 flex-1 truncate text-left">
          <RadixSelect.Value placeholder={placeholder} />
        </span>
        <RadixSelect.Icon asChild>
          <Icon
            name="chevron"
            className="size-3.5 flex-none text-text-3 transition-transform duration-150 group-data-[state=open]:rotate-180"
          />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        {/* Portalled into <body>, which is still inside <html data-theme>, so
            the dark variant reaches it — the trap that would have caught a
            `.dark`-based sheet. `position="popper"` anchors to the trigger and
            flips near an edge, which is what the hand-rolled menus could not do. */}
        <RadixSelect.Content
          position="popper"
          align={align}
          sideOffset={6}
          className={cx(
            "z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-[11px]",
            "border border-border bg-surface p-1.5 shadow-[var(--shadow-2)]",
            // Scales out of the trigger rather than appearing beside it. Radix
            // computes the origin from the resolved side, so a menu that
            // flipped upward grows downward-to-up without us tracking that.
            // Exit is shorter than entry; Radix holds the node through it.
            "origin-[var(--radix-select-content-transform-origin)]",
            "data-[state=closed]:animate-lt-fade-out data-[state=open]:animate-lt-popover",
          )}
        >
          <RadixSelect.Viewport className="max-h-[var(--radix-select-content-available-height)]">
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value === "" ? EMPTY : option.value}
                className={cx(
                  "flex cursor-pointer items-center gap-2 rounded-[7px] px-2.5 py-2 text-[13px] font-medium text-text outline-none select-none",
                  "data-[highlighted]:bg-muted data-[state=checked]:text-accent-fg",
                )}
              >
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                {/* Reserved rather than conditional, so the labels do not shift
                    sideways as the tick moves between rows. */}
                <span className="ml-auto flex size-3.5 flex-none items-center">
                  <RadixSelect.ItemIndicator>
                    <Icon name="check" className="size-3.5" />
                  </RadixSelect.ItemIndicator>
                </span>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
