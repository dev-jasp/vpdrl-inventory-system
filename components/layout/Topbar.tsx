import { Icon } from "@/components/ui/Icon";
import { PageTitle } from "./PageTitle";
import { ThemeToggle } from "./ThemeToggle";
import { TopbarSearch } from "./TopbarSearch";

/**
 * The app shell's topbar: page title, global search, theme toggle and the
 * notifications bell, from `design/LabTrack Dashboard.dc.html`.
 */
export function Topbar() {
  return (
    <header className="sticky top-0 z-5 flex items-center gap-4 border-b border-border bg-surface px-7 py-[13px]">
      <PageTitle />
      <div className="ml-auto flex items-center gap-3.5">
        <TopbarSearch />
        <ThemeToggle />
        {/* TODO: no notifications feed yet — the dot is the design's static
            unread marker, and the control is inert until there is one. */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative grid size-[38px] place-items-center rounded-[10px] border border-border text-text-2 hover:bg-muted"
        >
          <Icon name="bell" className="size-[17px]" />
          <span className="absolute top-2 right-2 size-[7px] rounded-full border-[1.5px] border-white bg-[#ef4444]" />
        </button>
      </div>
    </header>
  );
}
