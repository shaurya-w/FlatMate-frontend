import Navbar from "./navbar";

interface DashboardLayoutProps {
  name: string;
  children: React.ReactNode;
}

export default function DashboardLayout({ name, children }: DashboardLayoutProps) {
  return (
      <><Navbar name={name} /><main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </main></>

  );
}
