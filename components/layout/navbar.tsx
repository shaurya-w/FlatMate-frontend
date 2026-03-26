"use client";

import { useRouter } from "next/navigation";

interface NavbarProps {
  name: string;
}

export default function Navbar({ name }: NavbarProps) {
  const router = useRouter(); // ✅ MUST be inside component

  return (
    <nav
      className="w-full px-4 sm:px-6 lg:px-8 py-0 flex items-center justify-between border-b h-14"
      style={{
        background: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <img src="/FlatMate_Logo.svg" alt="FlatMate" className="h-7 w-auto" />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">

        {/* ⚙️ Settings */}
        <button
          onClick={() => {
            console.log("⚙️ Go to settings");
            router.push("/admin-dashboard/settings");
          }}
          className="p-2 rounded-full hover:bg-gray-100 transition"
          title="Settings"
        >
          ⚙️
        </button>

        {/* Welcome */}
        <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Welcome,
        </span>

        {/* User pill */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
          style={{
            background: "var(--secondary)",
            color: "var(--foreground)",
          }}
        >
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            {name?.charAt(0)?.toUpperCase()}
          </span>
          {name}
        </div>

      </div>
    </nav>
  );
}