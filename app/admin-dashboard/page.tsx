"use client";

import RenderUsers from "../../components/RenderUsers";
import AdminMetrics from "../../components/AdminMetrics";
import DashboardLayout from "../../components/layout/dashboardlayout";
import NoticeModal from "../../components/ui/NoticeModal";
import AdminComplaintBoard from "@/components/AdminComplaintBoard";
import { useAuth } from "@/hooks/useAuth";

export default function AdminDashboard() {
  const { user, loading } = useAuth("ADMIN");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--border)", borderTopColor: "var(--primary)" }}
          />
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>User not found</p>
      </div>
    );
  }

  return (
    <DashboardLayout name={user.name}>
      {/* Page header */}
      <div className="mb-8 animate-fade-in">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--foreground)", letterSpacing: "-0.02em" }}
        >
          Society Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
          Manage residents, invoices, notices, and complaints
        </p>
      </div>

      {/* Metrics */}
      <AdminMetrics />

      {/* Residents table */}
      <div className="mb-8">
        <RenderUsers />
      </div>

       {/* Notice action bar */}
      <div
        className="flex items-center justify-between mb-6 px-5 py-4 rounded-2xl"
        style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-xs)" }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Community Notices</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Post announcements to all residents</p>
        </div>
        <NoticeModal societyId={1} />
      </div>

      {/* Complaint board */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>Complaint Board</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Review and respond to resident complaints</p>
          </div>
        </div>
        <AdminComplaintBoard societyId={1} />
      </div>
    </DashboardLayout>
  );
}
