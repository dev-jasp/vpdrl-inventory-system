// App shell for every authenticated view: collapsible sidebar (navDef groups
// GENERAL / PEOPLE / PROCUREMENT / SYSTEM), topbar with search, breadcrumb,
// theme toggle and user menu.
// TODO: build from `LabTrack Dashboard.dc.html` — components/layout/.

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
