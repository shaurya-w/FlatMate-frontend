import Navbar from "./navbar";

interface DashboardLayoutProps {
  name: string;
  children: React.ReactNode;
}

export default function DashboardLayout({
  name,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <Navbar name={name} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {children}
      </main>

    </div>
  );
}
