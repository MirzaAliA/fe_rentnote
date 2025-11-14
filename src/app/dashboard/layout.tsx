export default function DashboardLayout({
  sidebar,
  content,
}: {
  sidebar: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <main className="h-full flex-1">{content}</main>
      <aside className="fixed bottom-0 h-auto w-full">{sidebar}</aside>
    </div>
  );
}
