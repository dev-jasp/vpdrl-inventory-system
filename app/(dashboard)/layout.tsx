import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

// App shell for every view: collapsible sidebar (GENERAL / PEOPLE /
// PROCUREMENT / SYSTEM) plus a topbar with search, theme toggle and user menu.
// Built from `design/LabTrack Dashboard.dc.html`.

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-1 bg-bg text-text">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-7 pt-3.5 pb-[34px]">{children}</main>
      </div>
    </div>
  );
}
