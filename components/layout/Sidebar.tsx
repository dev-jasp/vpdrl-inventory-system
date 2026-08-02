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
        "sticky top-0 flex h-screen flex-none flex-col self-start border-r border-border bg-surface transition-[width] duration-[180ms] ease-out",
        rail ? "w-[68px]" : "w-[236px]",
      )}
    >
      {rail ? (
        <div className="flex justify-center pt-4 pb-[18px]">
          <RailToggle rail={rail} onToggle={toggleRail} />
        </div>
      ) : (
        <div className="flex items-center gap-[11px] px-4 pt-[18px] pb-5">
          <span className="grid size-[34px] flex-none place-items-center rounded-md bg-accent text-sm font-semibold tracking-[-0.02em] text-white">
            VI
          </span>
          <span className="min-w-0 text-[15px] font-semibold tracking-[-0.015em]">
            
          </span>
          <RailToggle rail={rail} onToggle={toggleRail} />
        </div>
      )}

      <nav
        aria-label="Main"
        className={cx(
          "flex min-h-0 flex-1 flex-col gap-[18px] overflow-auto pb-3",
          rail ? "px-[10px]" : "px-3",
        )}
      >
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-0.5">
            {rail ? (
              <div className="mx-1.5 mb-[7px] h-px bg-muted" />
            ) : (
              <div className={cx(navGroupLabel, "px-2.5 pb-[7px]")}>
                {group.label}
              </div>
            )}
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
                    />
                    {item.children && subNavOpen && !rail ? (
                      <Suspense
                        fallback={
                          <NavChildList
                            id={subNavId}
                            groups={item.children}
                            active={null}
                          />
                        }
                      >
                        <NavChildLinks id={subNavId} groups={item.children} />
                      </Suspense>
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
      className={cx(
        "grid size-7 flex-none place-items-center rounded-lg border border-border bg-surface text-text-3 hover:bg-bg",
        rail ? "" : "ml-auto",
      )}
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
}: {
  item: NavItem;
  rail: boolean;
  active: boolean;
  subNavId: string;
  subNavOpen: boolean;
  onToggleSubNav: () => void;
}) {
  // The design's row both navigates and expands. Splitting the caret off keeps
  // the disclosure reachable without leaving the page you are on.
  const hasCaret = Boolean(item.children) && !rail;

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
        className={cx(
          "flex min-w-0 flex-1 items-center gap-[10px] rounded-[9px] py-[9px]",
          rail ? "justify-center" : "pl-[11px]",
          !rail && !hasCaret && "pr-[11px]",
        )}
      >
        <Icon
          name={item.icon}
          className={rail ? "size-[22px]" : "size-[18px]"}
        />
        {rail ? (
          <span className="sr-only">{item.label}</span>
        ) : (
          <span className={cx(navItemLabel, "flex-1 whitespace-nowrap")}>
            {item.label}
          </span>
        )}
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
