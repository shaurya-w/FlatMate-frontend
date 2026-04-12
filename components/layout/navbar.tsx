"use client";

import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/useLogout";

interface NavbarProps {
    name: string;
}

export default function Navbar({ name }: NavbarProps) {
    const router = useRouter();
    const handleLogout = useLogout();

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
                    onClick={() => router.push("/admin-dashboard/settings")}
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

                {/* 🚪 Logout Button */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition hover:opacity-80"
                    style={{
                        background: "var(--destructive)",
                        color: "var(--destructive-foreground)",
                    }}
                    title="Logout"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                        />
                    </svg>
                    Logout
                </button>

            </div>
        </nav>
    );
}