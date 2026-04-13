import Navbar from "./navbar";

interface DashboardLayoutProps {
  name: string;
  children: React.ReactNode;
}

export default function DashboardLayout({ name, children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full" />
      </div>
      <Navbar name={name} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
