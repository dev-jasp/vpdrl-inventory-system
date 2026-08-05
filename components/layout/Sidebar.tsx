"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useId, useState } from "react";

import { Icon } from "@/components/ui/Icon";
import { cx } from "@/utils/cx";
import { NavChildLinks, NavChildList } from "./NavChildLinks";
import { UserMenu } from "./UserMenu";
import { NAV_GROUPS, isSectionActive, type NavItem } from "./navItems";
import { navGroupLabel, navItemLabel } from "./navType";

/**
 * The app shell's sidebar, from `design/LabTrack Dashboard.dc.html`: brand,
 * four nav groups, and the user menu, collapsible to a 68px icon rail.
 */
export function Sidebar() {
  const pathname = usePathname();
  const [rail, setRail] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Sub-lists start open, as in the design; closing one is per nav item.
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const idPrefix = useId();

  function toggleRail() {
    setRail((value) => !value);
    // The rail is too narrow to anchor the menu against.
    setMenuOpen(false);
  }

  return (
    <div
      className={cx(
        "sticky top-0 flex h-screen flex-none flex-col self-start border-r border-border bg-bg transition-[width] duration-180 ease-out",
        // Nothing inside reflows as the box narrows — it is clipped instead.
        // Text that rewraps and re-ellipsises on every frame of a width
        // transition is most of what makes a collapsing sidebar look cheap.
        "overflow-hidden",
        rail ? "w-[64px]" : "w-65",
      )}
    >
      {/* One structure for both states rather than a branch per state. A
          conditional cannot animate its own removal, so anything that unmounts
          on the way to the rail leaves instantly while the box is still
          moving; everything here transitions between two sets of values on
          nodes that stay mounted throughout. */}
      <div
        className={cx(
          "flex items-center transition-[padding,column-gap] duration-180 ease-out",
          rail
            ? "gap-0 px-[18px] pt-4 pb-[18px]"
            : "gap-[11px] px-4 pt-[18px] pb-5",
        )}
      >
        {/* Collapses to nothing rather than disappearing: width and opacity
            both run, so the mark shrinks out of the way and the toggle takes
            its place instead of jumping into it. */}
        <span
          className={cx(
            "grid h-[34px] flex-none place-items-center overflow-hidden rounded-md bg-accent text-sm font-semibold tracking-[-0.02em] text-white transition-[width,opacity] duration-180 ease-out",
            rail ? "w-0 opacity-0" : "w-[34px] opacity-100",
          )}
        >
          VI
        </span>
        <span className="min-w-0 text-[15px] font-semibold tracking-[-0.015em]"></span>
        {/* `ml-auto` in both states, so the button rides the container's right
            edge inward as the width transitions instead of being re-centred
            by a different layout. At the rail's 18px gutter that lands it
            dead centre with no second rule to keep in sync. */}
        <RailToggle rail={rail} onToggle={toggleRail} />
      </div>

      <nav
        aria-label="Main"
        className={cx(
          "flex min-h-0 flex-1 flex-col gap-[18px] pb-3 lg:pt-6.5",
          // Vertical scroll only. `overflow-auto` would let the labels the
          // narrowing rail pushes out of bounds raise a horizontal scrollbar
          // partway through the transition.
          "overflow-x-hidden overflow-y-auto",
          // Matched to the container's own width transition, so the gutter
          // closes with the box rather than snapping a frame ahead of it.
          "transition-[padding] duration-180 ease-out",
          rail ? "px-[10px]" : "px-3",
        )}
      >
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-0.5">
            {/* The heading gives way to the rule by height, not by swap: both
                stay mounted and one collapses as the other opens. `0fr`→`1fr`
                is what lets a block of unknown height transition at all —
                `height: auto` is not interpolable. */}
            <div
              className={cx(
                "grid transition-[grid-template-rows] duration-180 ease-out",
                rail ? "grid-rows-[0fr]" : "grid-rows-[1fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className={cx(navGroupLabel, "px-2.5 pb-[7px]")}>
                  {group.label}
                </div>
              </div>
            </div>
            <div
              className={cx(
                "grid transition-[grid-template-rows] duration-180 ease-out",
                rail ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="mx-1.5 mb-[7px] h-px bg-muted" />
              </div>
            </div>
            <ul aria-label={group.label} className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const subNavId = `${idPrefix}${item.href}`;
                const subNavOpen = !collapsed[item.href];
                return (
                  <li key={item.href}>
                    <NavRow
                      item={item}
                      rail={rail}
                      active={isSectionActive(item, pathname)}
                      subNavId={subNavId}
                      subNavOpen={subNavOpen}
                      onToggleSubNav={() =>
                        setCollapsed((value) => ({
                          ...value,
                          [item.href]: subNavOpen,
                        }))
                      }
                      onOpenSubNav={() =>
                        setCollapsed((value) => ({
                          ...value,
                          [item.href]: false,
                        }))
                      }
                    />
                    {/* Height-collapsed rather than unmounted, which is what
                        lets it close on the way to the rail instead of
                        vanishing and dropping the whole nav upward. It also
                        settles the older mismatch here: the caret animated
                        over 160ms while the list it controls snapped. */}
                    {item.children ? (
                      <div
                        className={cx(
                          "grid transition-[grid-template-rows] duration-180 ease-out",
                          subNavOpen && !rail
                            ? "grid-rows-[1fr]"
                            : "grid-rows-[0fr]",
                        )}
                        // Still in the DOM when collapsed, so without this the
                        // links stay tabbable behind a zero-height clip.
                        inert={!subNavOpen || rail}
                      >
                        <div className="overflow-hidden">
                          <Suspense
                            fallback={
                              <NavChildList
                                id={subNavId}
                                groups={item.children}
                                active={null}
                              />
                            }
                          >
                            <NavChildLinks
                              id={subNavId}
                              groups={item.children}
                            />
                          </Suspense>
                        </div>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="flex-none border-t border-border px-3 pt-3 pb-3.5">
        <UserMenu rail={rail} open={menuOpen} onOpenChange={setMenuOpen} />
      </div>
    </div>
  );
}

function RailToggle({
  rail,
  onToggle,
}: {
  rail: boolean;
  onToggle: () => void;
}) {
  const label = rail ? "Expand sidebar" : "Collapse sidebar";
  return (
    <button
      type="button"
      onClick={onToggle}
      title={label}
      aria-label={label}
      className="ml-auto grid size-7 flex-none place-items-center rounded-lg border border-border bg-surface text-text-3 hover:bg-bg"
    >
      <Icon name="panel" className="size-[15px]" />
    </button>
  );
}

function NavRow({
  item,
  rail,
  active,
  subNavId,
  subNavOpen,
  onToggleSubNav,
  onOpenSubNav,
}: {
  item: NavItem;
  rail: boolean;
  active: boolean;
  subNavId: string;
  subNavOpen: boolean;
  onToggleSubNav: () => void;
  onOpenSubNav: () => void;
}) {
  // The design's row both navigates and expands, and it does both here. The
  // caret is split off on top of that, not instead of it: it toggles the
  // disclosure without leaving the page you are on, which the row alone
  // cannot do.
  const hasCaret = Boolean(item.children) && !rail;

  // Arriving somewhere opens it; clicking where you already are toggles it.
  // A row that toggled unconditionally would shut a section's filters at the
  // moment you navigated into it, which is the one case nobody asks for — and
  // on the rail there is no disclosure on screen to be toggling, so a click
  // there only ever leaves it open for when the sidebar comes back.
  const onRowClick = active && !rail ? onToggleSubNav : onOpenSubNav;

  return (
    <div
      className={cx(
        "flex items-center rounded-[9px]",
        active ? "bg-tint-blue text-accent-fg" : "text-text hover:bg-bg",
      )}
    >
      <Link
        href={item.href}
        title={item.label}
        aria-current={active ? "page" : undefined}
        onClick={onRowClick}
        className={cx(
          // `pl-[11px]` in both states rather than swapping to
          // `justify-center`. The rail's 44px of row less an 11px gutter
          // leaves exactly the 22px the icon grows to, so the same padding
          // that indents it when expanded centres it on the rail — and the
          // icon never moves, it only grows.
          "flex min-w-0 flex-1 items-center gap-[10px] rounded-[9px] py-[9px] pl-[11px]",
          !rail && !hasCaret && "pr-[11px]",
        )}
      >
        {/* Grows to hold the row on its own once the label is gone.
            Transitioned, not swapped, so it scales with the box instead of
            jumping a size mid-slide. */}
        <Icon
          name={item.icon}
          className={cx(
            "transition-[width,height] duration-180 ease-out",
            rail ? "size-[22px]" : "size-[18px]",
          )}
        />
        {/* Mounted in both states and faded, never swapped for an `sr-only`
            copy — that swap is what made the labels cut out a frame into the
            collapse. It keeps the row's accessible name either way, and the
            clipped container hides what the fade leaves behind. Out faster
            than the box closes, so the text is gone before the edge reaches
            it. */}
        <span
          className={cx(
            navItemLabel,
            "flex-1 whitespace-nowrap transition-opacity duration-120 ease-out",
            rail ? "opacity-0" : "opacity-100",
          )}
        >
          {item.label}
        </span>
      </Link>
      {hasCaret ? (
        <button
          type="button"
          onClick={onToggleSubNav}
          aria-expanded={subNavOpen}
          aria-controls={subNavOpen ? subNavId : undefined}
          className="grid place-items-center rounded-[9px] px-[11px] py-[9px]"
        >
          <Icon
            name="chevron"
            className={cx(
              "size-[15px] transition-transform duration-[160ms]",
              subNavOpen ? "rotate-0" : "-rotate-90",
            )}
          />
          <span className="sr-only">
            {subNavOpen ? "Hide" : "Show"} {item.label} filters
          </span>
        </button>
      ) : null}
    </div>
  );
}
