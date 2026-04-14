"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLogout } from "@/hooks/useLogout";
import { useState } from "react";
import flatmate_logo from "@/public/FlatMate_Logo.svg";

interface NavbarProps {
  name: string;
}

export default function Navbar({ name }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const handleLogout = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = pathname?.startsWith("/admin-dashboard") ?? false;
  const isSettings = pathname?.includes("/settings") ?? false;

  return (
    <nav
      className="sticky top-0 z-40 w-full h-14 flex items-center px-4 sm:px-6"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        boxShadow: "var(--shadow-xs)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <img src={flatmate_logo.src} alt="FlatMate" className="h-6 w-auto" />
      </div>

      {/* Nav Links (admin only) */}
      {isAdmin && (
        <div className="hidden sm:flex items-center gap-1 ml-8">
          <NavLink
            label="Dashboard"
            active={!isSettings}
            onClick={() => router.push("/admin-dashboard")}
          />
          <NavLink
            label="Settings"
            active={isSettings}
            onClick={() => router.push("/admin-dashboard/settings")}
          />
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Settings icon (admin only, desktop) */}
        {isAdmin && (
          <button
            onClick={() => router.push("/admin-dashboard/settings")}
            className="hidden sm:flex p-2 rounded-lg transition-colors"
            style={{ color: "var(--muted-foreground)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--muted)";
              e.currentTarget.style.color = "var(--foreground)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--muted-foreground)";
            }}
            title="Settings"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        )}

        {/* User pill */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-default select-none"
          style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
        >
          <span
            className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: "var(--primary)", color: "white", fontSize: "0.65rem" }}
          >
            {name?.charAt(0)?.toUpperCase()}
          </span>
          <span className="text-sm font-medium hidden sm:block" style={{ color: "var(--foreground)", maxWidth: "120px" }}>
            {name}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
          style={{ color: "var(--muted-foreground)", border: "1px solid var(--border)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--destructive-subtle)";
            e.currentTarget.style.color = "var(--destructive)";
            e.currentTarget.style.borderColor = "var(--destructive)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--muted-foreground)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </nav>
  );
}

function NavLink({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
      style={{
        background: active ? "var(--primary-subtle)" : "transparent",
        color: active ? "var(--primary)" : "var(--muted-foreground)",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "var(--muted)";
          e.currentTarget.style.color = "var(--foreground)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--muted-foreground)";
        }
      }}
    >
      {label}
    </button>
  );
}
