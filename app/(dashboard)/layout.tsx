import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

// App shell for every view: collapsible sidebar (GENERAL / PEOPLE /
// PROCUREMENT / SYSTEM) plus a topbar with search, theme toggle and user menu.
// Built from `design/LabTrack Dashboard.dc.html`.

// `modal` is the parallel slot in `app/(dashboard)/@modal`: the intercepted
// item form, when one is open. It renders alongside the page rather than
// instead of it, which is what lays the design's dialog over the list it was
// opened from. Typed from the route literal, so the slot names come from the
// file system rather than being repeated here.

export default function DashboardLayout({ children, modal }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-1 bg-bg text-text">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-7 pt-3.5 pb-[34px]">{children}</main>
      </div>
      {modal}
    </div>
  );
}
