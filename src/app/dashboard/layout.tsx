import Sidebar from "./sidebar/page";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <main className="h-full flex-1">{children}</main>
      <aside className="fixed bottom-0 h-auto w-full">
        <Sidebar />
      </aside>
    </div>
  );
}
