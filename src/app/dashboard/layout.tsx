export default function DashboardLayout({
  sidebar,
  content,
}: {
  sidebar: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <div>
      <aside>{sidebar}</aside>
      <main className="ml-[15vw]">{content}</main>
    </div>
  );
}
