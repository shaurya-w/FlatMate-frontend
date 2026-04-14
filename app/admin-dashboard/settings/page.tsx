"use client";

import ChargesSection from "./ChargesSection";
import ContactsSection from "./ContactsSection";
import DashboardLayout from "@/components/layout/dashboardlayout";
import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
  const { user, loading } = useAuth("ADMIN");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }} />
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout name={user.name}>
      {/* Page header */}
      {/* Sections */}
      <div className="space-y-12">
        <ChargesSection />
        <div style={{ borderTop: "1px solid var(--border)" }} />
        <ContactsSection />
      </div>
    </DashboardLayout>
  );
}
